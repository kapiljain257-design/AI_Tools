# Quick Reference - Database & Debugging Commands

## 🗄️ MongoDB Quick Commands

### Connect to Database
```bash
# Local connection
mongosh mongodb://localhost:27017/microservice_tools

# In MongoDB shell, use these commands:
use microservice_tools
show collections
```

### View Recent Login Sessions
```javascript
db.login_sessions.find().sort({timestamp: -1}).limit(10).pretty()
```

### View Tool Usage by User
```javascript
db.tool_usage.find({userEmail: "admin@tda.com"}).sort({timestamp: -1}).limit(10).pretty()
```

### View Tool Usage by Tool
```javascript
db.tool_usage.find({toolId: "nova"}).sort({timestamp: -1}).limit(5).pretty()
```

### View User Statistics
```javascript
db.user_statistics.find().pretty()
```

### Count Total Executions
```javascript
db.tool_usage.countDocuments()
```

### View Failed Executions
```javascript
db.tool_usage.find({status: "error"}).pretty()
```

### Delete Old Logs (Keep Last 100)
```javascript
db.execution_logs.deleteMany({})
```

### Export Data to CSV/JSON
```bash
# Export login sessions
mongoexport \
  --uri "mongodb://localhost:27017/microservice_tools" \
  --collection login_sessions \
  --out login_sessions.json

# Export tool usage
mongoexport \
  --uri "mongodb://localhost:27017/microservice_tools" \
  --collection tool_usage \
  --out tool_usage.json
```

---

## 🔧 API Testing Commands

### Check All Tools Available
```bash
curl http://localhost:5000/api/tools | jq
```

### Check Tool Health
```bash
# Nova
curl http://localhost:5000/api/tools/nova/status

# All tools
for tool in nova indus-report perfectto repro-tool image-generator; do
  echo "$tool status:"; curl http://localhost:5000/api/tools/$tool/status; echo ""
done
```

### Test Nova Tool
```bash
curl -X POST http://localhost:5000/api/tools/nova/process \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "test input",
    "type": "text",
    "userEmail": "admin@tda.com",
    "userGroups": ["qipl.tda.developers"]
  }' | jq
```

### Get Analytics
```bash
curl http://localhost:5000/api/analytics | jq
```

### Get Filtered Tools for User
```bash
curl -X POST http://localhost:5000/api/tools/filtered \
  -H "Content-Type: application/json" \
  -d '{"userGroups": ["qipl.tda.developers"]}' | jq
```

---

## 📋 Backend Service Logs

### View API Gateway Logs
```bash
# If running in separate terminal
# Look at the terminal where you ran: npm start (backend)

# Or check via ps command
ps aux | grep "api-gateway\|node"
```

### View Specific Tool Logs
```bash
# Check if service is responding
curl http://localhost:5001/health  # Nova
curl http://localhost:5002/health  # Indus Report
curl http://localhost:5003/health  # Perfectto
curl http://localhost:5004/health  # Repro Tool
curl http://localhost:5005/health  # Image Generator
```

### Expected Health Response
```json
{"active": true, "tool": "translator"}
```

---

## 🌐 Frontend Browser Console Debugging

### Check localStorage (Theme, User Data)
```javascript
// In browser console (F12)
localStorage.getItem('theme')
localStorage.getItem('user')
localStorage.getItem('loginSkipped')

// View all
Object.entries(localStorage).forEach(([k,v]) => console.log(k, ':', v))
```

### Clear Storage (If Needed)
```javascript
localStorage.clear()
sessionStorage.clear()
```

### Check Network Requests
```
1. Open F12 → Network tab
2. Perform an action (e.g., login, tool execution)
3. Look for requests to:
   - /api/tools
   - /api/tools/filtered
   - /api/tools/{id}/process
   - /api/tools/{id}/status
```

### View React Component State
```
1. Install React DevTools browser extension
2. F12 → Components tab
3. Select components to inspect their state
```

---

## 🔍 Port Verification

### Check All Services Running
```bash
# Check all ports
for port in 3001 5000 5001 5002 5003 5004 5005; do
  if lsof -i :$port 2>/dev/null | grep -q LISTEN; then
    echo "✅ Port $port: OPEN"
  else
    echo "❌ Port $port: CLOSED"
  fi
done
```

### Kill Service on Port (if stuck)
```bash
# Kill process on port 5000
lsof -i :5000 | grep -v COMMAND | awk '{print $2}' | xargs kill -9

# Or use fuser
fuser -k 5000/tcp
```

---

## 📊 Performance Monitoring

### MongoDB Query Performance
```javascript
// Enable profiling
db.setProfilingLevel(1, {slowms: 100})

// View slow queries
db.system.profile.find({millis: {$gt: 100}}).pretty()

// Disable profiling
db.setProfilingLevel(0)
```

### Network Request Performance
```javascript
// In browser console
performance.getEntriesByType("navigation")[0]
performance.getEntriesByType("resource").forEach(entry => {
  console.log(`${entry.name}: ${entry.duration.toFixed(2)}ms`)
})
```

### API Response Time
```bash
# Test API gateway response time
time curl http://localhost:5000/api/tools

# Test tool service response time
time curl http://localhost:5001/health
```

---

## 🧹 Maintenance Commands

### Backup Database
```bash
# Create backup
mongodump \
  --uri "mongodb://localhost:27017/microservice_tools" \
  --out ./backup_$(date +%Y%m%d_%H%M%S)

# Restore from backup
mongorestore \
  --uri "mongodb://localhost:27017/microservice_tools" \
  --dir ./backup_20260408_123456
```

### Clean Old Logs
```javascript
// Delete logs older than 30 days
db.execution_logs.deleteMany({
  timestamp: {$lt: new Date(Date.now() - 30*24*60*60*1000)}
})

// Delete old tool status history
db.tool_status_history.deleteMany({
  timestamp: {$lt: new Date(Date.now() - 7*24*60*60*1000)}
})
```

### Compact Database
```bash
# Compact all collections
mongosh << EOF
use microservice_tools
Object.keys(db).forEach(name => {
  if (name !== 'system.indexes') db[name].reIndex()
})
EOF
```

---

## 🚀 Service Startup Commands

### Start Everything (from project root)
```bash
# Terminal 1: Backend Services
cd backend
node api-gateway/index.js &
node nova/index.js &
node indus-report/index.js &
node perfectto/index.js &
node repro-tool/index.js &
node image-generator/index.js &

# Terminal 2: Frontend
cd frontend
npm start

# Terminal 3: MongoDB (if needed)
mongod --dbpath ./data
```

### One-Command Startup (if using npm scripts)
```bash
# From project root, run all services
npm run start:all  # If configured in package.json
```

---

## 📝 Useful Queries Summary

| Task | Command |
|------|---------|
| Count users | `db.users.countDocuments()` |
| Count logins today | `db.login_sessions.countDocuments({timestamp: {$gte: new Date(new Date().setHours(0,0,0,0))}})` |
| Top 3 tools | `db.tool_usage.aggregate([{$group: {_id: "$toolId", count: {$sum: 1}}}, {$sort: {count: -1}}, {$limit: 3}])` |
| User activity | `db.tool_usage.aggregate([{$group: {_id: "$userEmail", count: {$sum: 1}}}, {$sort: {count: -1}}])` |
| Success rate | `db.tool_usage.aggregate([{$group: {_id: null, success: {$sum: {$cond: [{$eq: ["$status", "success"]}, 1, 0]}}, total: {$sum: 1}}}, {$project: {successRate: {$multiply: [{$divide: ["$success", "$total"]}, 100]}}}])` |

---

**Last Updated:** April 8, 2026
**Website Status:** http://localhost:3001 ✅
**Database:** mongodb://localhost:27017/microservice_tools ✅
