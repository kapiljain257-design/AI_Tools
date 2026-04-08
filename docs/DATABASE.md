# TDA AI NEXUS - Database Documentation

## Overview
TDA AI NEXUS uses MongoDB to store user activities, login records, tool usage statistics, and execution logs. This document explains what data is collected, how to access it, and how to monitor user activity.

---

## Database Collections & Schemas

### 1. **Users Collection** (`users`)
Stores user login credentials and profile information.

```javascript
{
  _id: ObjectId,
  email: String,              // User email from login
  apiKey: String,             // Encrypted API key
  userGroups: [String],       // Array of user groups (e.g., ['qipl.tda.developers', 'qipl.nova.users'])
  createdAt: Date,            // Account creation timestamp
  lastLogin: Date,            // Last login timestamp
  loginCount: Number,         // Total login attempts
  active: Boolean,            // Account active status
  theme: String,              // Preferred theme ('light' or 'dark')
  metadata: {
    browser: String,
    ipAddress: String,
    userAgent: String
  }
}
```

### 2. **Login Sessions Collection** (`login_sessions`)
Tracks every login attempt with timestamps and results.

```javascript
{
  _id: ObjectId,
  email: String,
  timestamp: Date,            // Login attempt time
  success: Boolean,           // Login successful or failed
  userGroups: [String],       // Groups assigned to user
  sessionId: String,          // Unique session identifier
  expiresAt: Date,            // Session expiration time
  metadata: {
    browser: String,
    operatingSystem: String,
    ipAddress: String,
    location: String
  }
}
```

### 3. **Tool Usage Collection** (`tool_usage`)
Tracks all tool executions and usage statistics.

```javascript
{
  _id: ObjectId,
  toolId: String,             // Tool identifier (nova, indus-report, etc.)
  userEmail: String,          // User who executed the tool
  userGroups: [String],       // User groups at time of execution
  timestamp: Date,            // Execution time
  inputLength: Number,        // Length of input prompt
  outputLength: Number,       // Length of output result
  executionTime: Number,      // Execution duration in milliseconds
  status: String,             // 'success', 'error', 'timeout'
  errorMessage: String,       // Error details if failed
  type: String,               // Input type (e.g., 'text', 'image')
  result: String,             // Truncated result (first 1000 chars)
  apiKey: String              // Associated API key (encrypted)
}
```

### 4. **Tool Status History Collection** (`tool_status_history`)
Monitors tool service availability and uptime.

```javascript
{
  _id: ObjectId,
  toolId: String,
  timestamp: Date,
  active: Boolean,            // Service running or not
  responseTime: Number,       // Health check response time in ms
  statusCode: Number,         // HTTP status code
  errorMessage: String,       // If health check failed
  uptime: Number              // Cumulative uptime percentage
}
```

### 5. **User Statistics Collection** (`user_statistics`)
Aggregated statistics for each user.

```javascript
{
  _id: ObjectId,
  email: String,
  totalLogins: Number,        // Total login count
  totalToolExecutions: Number,// Total tool runs
  successfulExecutions: Number,
  failedExecutions: Number,
  averageExecutionTime: Number,
  toolBreakdown: {
    nova: Number,
    'indus-report': Number,
    'perfectto': Number,
    'repro-tool': Number,
    'image-generator': Number
  },
  lastActivityDate: Date,
  accountCreatedDate: Date,
  preferredTools: [String],   // Most used tools
  dataUsedInMB: Number        // Total data processed
}
```

### 6. **Execution Logs Collection** (`execution_logs`)
Detailed execution logs for debugging and audit purposes.

```javascript
{
  _id: ObjectId,
  toolId: String,
  userEmail: String,
  timestamp: Date,
  logLevel: String,           // 'info', 'debug', 'warning', 'error', 'success'
  message: String,
  details: Object,
  stackTrace: String          // Error stack trace if applicable
}
```

---

## Important Statistics Saved

### User Activity Metrics
- ✅ Login timestamp and frequency
- ✅ User email and assigned groups
- ✅ Session duration and expiration
- ✅ Device/browser information
- ✅ IP address and location
- ✅ Login success/failure rate

### Tool Usage Metrics
- ✅ Tool execution count per user
- ✅ Tool execution success rate
- ✅ Average execution time per tool
- ✅ Input/output data sizes
- ✅ Error rates and error messages
- ✅ Most used tools per user

### System Metrics
- ✅ Tool service availability (uptime)
- ✅ Service response times
- ✅ Error/failure rates
- ✅ Total data processed
- ✅ Peak usage times

### Security Metrics
- ✅ Failed login attempts
- ✅ Account lockout events (if implemented)
- ✅ API key usage patterns
- ✅ User group assignments and changes
- ✅ Session expiration and timeouts

---

## How to Connect to MongoDB

### Option 1: Connect Locally (Development Machine)

#### Prerequisites
- MongoDB installed: [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
- MongoDB running on localhost:27017

#### Using MongoDB Shell (mongosh)
```bash
# Connect to local MongoDB
mongosh mongodb://localhost:27017/microservice_tools

# List all databases
show databases

# Select TDA AI NEXUS database
use microservice_tools

# List all collections
show collections

# Sample queries
db.login_sessions.find().limit(5)
db.tool_usage.find({email: "your-email@example.com"})
db.users.findOne({email: "your-email@example.com"})
```

#### Using MongoDB Compass (GUI)
1. Download: [https://www.mongodb.com/products/compass](https://www.mongodb.com/products/compass)
2. Click "New Connection"
3. Enter connection string: `mongodb://localhost:27017`
4. Browse collections visually

#### Using Node.js Script
```bash
# Create a query script
cat > query.js << 'EOF'
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/microservice_tools', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');
  
  // Query users
  const users = await db.collection('users').find({}).limit(5).toArray();
  console.log('Recent Users:', users);
  
  // Query login sessions
  const sessions = await db.collection('login_sessions').find({}).limit(10).toArray();
  console.log('Recent Login Sessions:', sessions);
  
  process.exit(0);
});
EOF

node query.js
```

### Option 2: Connect to Remote MongoDB (Server Deployment)

#### Using Connection String
```bash
# Standard connection string format
mongosh "mongodb+srv://username:password@cluster.mongodb.net/microservice_tools"

# Or using connection URI
mongosh "mongodb://username:password@server-ip:27017/microservice_tools"
```

#### Environment Variable Setup
```bash
# Set MongoDB URI for the application
export MONGODB_URI="mongodb://username:password@server-ip:27017/microservice_tools"

# Restart application
npm start
```

#### In Application Code
```javascript
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/microservice_tools';
mongoose.connect(mongoUri, { useNewUrlParser: true });
```

### Option 3: Docker MongoDB Container

```bash
# Start MongoDB in Docker
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:latest

# Connect to it
mongosh "mongodb://admin:password@localhost:27017/microservice_tools?authSource=admin"
```

---

## Common Database Queries

### View Recent Logins
```javascript
db.login_sessions.find().sort({timestamp: -1}).limit(10);
```

### View User Statistics
```javascript
db.user_statistics.find({
  totalLogins: {$gt: 5}
}).sort({lastActivityDate: -1});
```

### View Tool Usage by Tool
```javascript
db.tool_usage.aggregate([
  {$group: {
    _id: "$toolId",
    count: {$sum: 1},
    avgExecutionTime: {$avg: "$executionTime"}
  }},
  {$sort: {count: -1}}
]);
```

### View Failed Executions
```javascript
db.tool_usage.find({status: "error"}).sort({timestamp: -1}).limit(20);
```

### User Activity Report
```javascript
db.tool_usage.aggregate([
  {$match: {userEmail: "user@example.com"}},
  {$group: {
    _id: "$toolId",
    executions: {$sum: 1},
    successes: {$sum: {$cond: [{$eq: ["$status", "success"]}, 1, 0]}}
  }},
  {$sort: {executions: -1}}
]);
```

### Top Tools Used
```javascript
db.tool_usage.aggregate([
  {$group: {
    _id: "$toolId",
    count: {$sum: 1},
    users: {$addToSet: "$userEmail"}
  }},
  {$sort: {count: -1}},
  {$limit: 5}
]);
```

---

## Backup & Export Data

### Export Collection to JSON
```bash
# Export users collection
mongoexport \
  --uri "mongodb://localhost:27017/microservice_tools" \
  --collection users \
  --out users_backup.json

# Export all collections
mongoexport \
  --uri "mongodb://localhost:27017/microservice_tools" \
  --collection login_sessions \
  --out login_sessions_backup.json
```

### Backup Entire Database
```bash
# Create backup
mongodump \
  --uri "mongodb://localhost:27017/microservice_tools" \
  --out ./backup

# Restore from backup
mongorestore \
  --uri "mongodb://localhost:27017/microservice_tools" \
  ./backup
```

---

## Database Integration in Application

The TDA AI NEXUS website automatically logs:
1. User login with email and assigned groups
2. Every tool execution with input/output details
3. Tool service status checks
4. Execution logs for debugging
5. User statistics for analytics

**No additional configuration required** - logs are collected automatically by the backend services!

---

## Monitoring & Analytics

### Dashboard Metrics Available
- Last 24 hours login count
- Tool usage breakdown
- Error rate percentage
- Average execution time
- Most active users
- Service uptime percentage

### Accessing Metrics
All metrics can be queried via MongoDB using the commands above or through a dedicated analytics dashboard (future feature).

---

## Data Retention Policy

| Collection | Retention Period | Notes |
|---|---|---|
| login_sessions | 90 days | Auto-deleted after 90 days |
| tool_usage | 180 days | Aggregated after 30 days |
| execution_logs | 30 days | Auto-cleaned for performance |
| user_statistics | Indefinite | Cumulative data |
| users | Indefinite | Account data |
| tool_status_history | 7 days | Minimal retention for uptime tracking |

---

## Troubleshooting

### MongoDB Connection Refused
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB if stopped
sudo systemctl start mongod

# On macOS
brew services start mongodb-community
```

### Authentication Failed
```bash
# Verify credentials in connection string
# Format: mongodb://username:password@host:port/database

# Check user exists in MongoDB
mongosh
use admin
db.getUser("username")
```

### Slow Queries
```javascript
// Enable profiling
use microservice_tools
db.setProfilingLevel(1, { slowms: 100 })

// View slow queries
db.system.profile.find({millis: {$gt: 100}}).pretty()
```

---

## Security Best Practices

✅ **Implemented:**
- Encrypted API keys in database
- User group-based access control
- Session expiration
- IP address logging

📋 **Recommended:**
- Enable MongoDB authentication in production
- Use VPN/SSL for database connections
- Regular database backups
- Audit logging for sensitive operations
- Data encryption at rest
- Row-level access control

---

## Support & Resources

- MongoDB Docs: https://docs.mongodb.com/
- Mongoose Docs: https://mongoosejs.com/
- MongoDB Compass: https://www.mongodb.com/products/compass
- Connection String Helper: https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/connection-target/

For questions, contact: support@example.com
