# Deployment and Tech Stack Reference

## 📋 What is Included

### Frontend
- **React 18.3.1** with functional components and hooks
- **Modular component architecture** with tool-specific interfaces
- **Theme support** (light/dark mode)
- **Permission-based UI** - displays only accessible tools per user group
- **Local storage** - persists user session and preferences

### Backend Architecture
- **API Gateway** - Node.js + Express (port 5000)
  - Central request proxy and router
  - Tool listing and filtering (by user permissions)
  - Health status checking
  - CORS and body-parser middleware

- **Microservices** - 5 independent Node.js + Express services
  - Nova (port 5001) - Text processing
  - Image Generator (port 5002) - Image generation
  - Indus Report (port 5003) - Report generation
  - Perfectto (port 5004) - QA/Optimization
  - Repro Tool (port 5005) - Issue tracking

### Data & Persistence
- **MongoDB** - Optional document database for each microservice
- **Mongoose** - ORM for MongoDB (can be added per service)
- **Environment variables** - `MONGODB_URI`, `PORT`, `PYTHON_EXECUTABLE` configuration

---

## 🛠️ Core Technologies

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Frontend | React 18.3.1 | UI rendering and state management |
| Backend Gateway | Express.js | Request routing and filtering |
| Microservices | Express.js | Tool-specific processing |
| Database | MongoDB | Session/data persistence |
| ORM | Mongoose | MongoDB abstraction |
| Middleware | cors, body-parser | API security and parsing |
| Package Manager | npm | Dependency management |

---

## 🔢 Port Configuration

| Service | Port | Environment |
|---------|------|-------------|
| **API Gateway** | 5000 | `PORT=5000` |
| **Nova** | 5001 | `PORT=5001` |
| **Image Generator** | 5002 | `PORT=5002` |
| **Indus Report** | 5003 | `PORT=5003` |
| **Perfectto** | 5004 | `PORT=5004` |
| **Repro Tool** | 5005 | `PORT=5005` |
| **MongoDB** | 27017 | `MONGODB_URI=mongodb://localhost:27017` |
| **Python** | - | `PYTHON_EXECUTABLE=python3` |
| **Frontend (React)** | 3001 | Development server |

---

## 📦 Deployment Guide

### Prerequisites
- **Node.js** 18+ (recommended 20+)
- **npm** 8+
- **Git**
- **MongoDB** (local installation or Docker)

### OS-Specific Setup

#### Ubuntu/Debian Linux
```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB (optional - local installation)
sudo apt update
sudo apt install -y mongodb
sudo systemctl enable mongod --now
```

#### macOS
```bash
# Install Node.js via Homebrew
brew install node@20
brew link node@20

# Install MongoDB via Homebrew (optional)
brew install mongodb-community
brew services start mongodb-community
```

#### Docker MongoDB (Cross-platform)
```bash
docker run -d --name tda-mongo -p 27017:27017 mongo:latest
```

### Clone & Install

```bash
# Clone repository
git clone https://github.com/kapiljain257-design/AI_Tools.git
cd AI_Tools

# Install backend API Gateway
cd backend/api-gateway
npm install
cd ..

# Install all tool microservices
for tool in nova image-generator indus-report perfectto repro-tool; do
  cd "$tool"
  npm install
  cd ..
done

# Install frontend
cd ../../frontend
npm install
```

### Configuration

#### Environment Variables
Create `.env` files in each service (optional):

**Backend services** (e.g., `backend/nova/.env`):
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/nova
PYTHON_EXECUTABLE=python3
NODE_ENV=development
```

Backend tool services now import shared runtime configuration from `backend/shared/toolConfig.js`, including `MONGODB_URI`, `PYTHON_EXECUTABLE`, default ports, and Python script locations. Override the Python runtime by setting `PYTHON_EXECUTABLE` in the service environment.

**API Gateway** (`backend/api-gateway/.env`):
```env
PORT=5000
NODE_ENV=development
```

**Frontend** (`frontend/.env`):
```env
REACT_APP_API_URL=http://localhost:5000
PORT=3001
```

### Running Locally

**Option 1: Multiple Terminal Windows**
```bash
# Terminal 1: API Gateway
cd backend/api-gateway && npm start

# Terminal 2-6: Tool Services (one per terminal)
cd backend/nova && npm start
cd backend/image-generator && npm start
cd backend/indus-report && npm start
cd backend/perfectto && npm start
cd backend/repro-tool && npm start

# Terminal 7: Frontend
cd frontend && npm start
```

**Option 2: Using tmux (Linux/macOS)**
```bash
tmux new-session -d -s tda
tmux new-window -t tda -n api-gateway -c /workspaces/AI_Tools/backend/api-gateway
tmux send-keys -t tda:api-gateway "npm start" Enter

tmux new-window -t tda -n nova -c /workspaces/AI_Tools/backend/nova
tmux send-keys -t tda:nova "npm start" Enter

# Continue for other services...

tmux new-window -t tda -n frontend -c /workspaces/AI_Tools/frontend
tmux send-keys -t tda:frontend "npm start" Enter

# Attach to session
tmux attach -t tda
```

**Option 3: Using pm2 (Production-like)**
```bash
npm install -g pm2

# Create ecosystem.config.js in project root
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'api-gateway',
      cwd: './backend/api-gateway',
      script: 'npm',
      args: 'start',
      instances: 1
    },
    {
      name: 'nova',
      cwd: './backend/nova',
      script: 'npm',
      args: 'start',
      instances: 1
    },
    {
      name: 'image-generator',
      cwd: './backend/image-generator',
      script: 'npm',
      args: 'start',
      instances: 1
    },
    {
      name: 'indus-report',
      cwd: './backend/indus-report',
      script: 'npm',
      args: 'start',
      instances: 1
    },
    {
      name: 'perfectto',
      cwd: './backend/perfectto',
      script: 'npm',
      args: 'start',
      instances: 1
    },
    {
      name: 'repro-tool',
      cwd: './backend/repro-tool',
      script: 'npm',
      args: 'start',
      instances: 1
    },
    {
      name: 'frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'start',
      instances: 1
    }
  ]
};
EOF

# Start all services
pm2 start ecosystem.config.js
pm2 logs
```

### Verification

Test the deployment with curl:

```bash
# Check API Gateway
curl -X GET http://localhost:5000/api/tools

# Check tool status
curl -X GET http://localhost:5000/api/tools/nova/status

# Test tool processing
curl -X POST http://localhost:5000/api/tools/nova/process \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Hello world", "type":"text"}'
```

Access frontend:
- **Development**: http://localhost:3001
- Use test credentials from [TESTING_GUIDE.md](./TESTING_GUIDE.md)

---

## 🚀 Production Deployment

### Frontend Build & Serve

```bash
cd frontend
npm run build

# Using Nginx to serve static files
sudo cp -r build/* /var/www/html/

# Or use serve package
npx serve -s build -l 5000
```

### Backend Deployment

#### Option 1: Docker Containers
```dockerfile
# Dockerfile for tool services
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5001
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t tda-nova .
docker run -d -p 5001:5001 --name nova tda-nova
```

#### Option 2: Virtual Machine/Server
Use systemd service files:

```ini
# /etc/systemd/system/tda-api-gateway.service
[Unit]
Description=TDA API Gateway
After=network.target

[Service]
Type=simple
User=tda-user
WorkingDirectory=/home/tda-user/AI_Tools/backend/api-gateway
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable tda-api-gateway
sudo systemctl start tda-api-gateway
```

#### Option 3: AWS/Cloud Deployment
- Deploy database to AWS RDS or MongoDB Atlas
- Use Lambda for serverless tool services
- Use Elastic Beanstalk or App Engine for API Gateway
- Host frontend on S3 + CloudFront

---

## 🔒 Security Recommendations

1. **Environment Variables**: Never commit `.env` files; use secrets management
2. **HTTPS**: Use SSL certificates in production
3. **API Keys**: Validate API keys on backend (not just client-side)
4. **CORS**: Configure CORS for specific origins in production
5. **Rate Limiting**: Add rate limiting middleware to API Gateway
6. **Database Auth**: Enable MongoDB authentication in production
7. **Logging**: Implement centralized logging (e.g., ELK stack)
8. **Monitoring**: Use APM tools like New Relic or DataDog

---

## 📊 Performance Optimization

- **Frontend**: Optimize bundle size with code splitting and lazy loading
- **Backend**: Use caching (Redis) for frequently accessed data
- **Database**: Add indexes for common queries
- **Horizontal Scaling**: Run multiple instances behind load balancer
- **CDN**: Serve static assets from CDN for faster delivery

---

## 🆚 Adding New Tools

1. Create service folder: `backend/new-tool/`
2. Copy from existing tool and modify port
3. Add to `backend/api-gateway/constants.js` tools array
4. Create React component: `frontend/src/components/tools/new-tool/NewToolInterface.js`
5. Update `frontend/src/App.js` routing logic
6. Restart services

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :5000
# Kill process
kill -9 <PID>
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### MongoDB Connection Error
```bash
# Check MongoDB running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod
```

### CORS Errors
- Check `backend/api-gateway/index.js` CORS configuration
- Ensure frontend URL matches allowed origins

---

## 📚 Related Documentation

- [README.md](./README.md) - Quick start guide
- [PERMISSION_SYSTEM.md](./PERMISSION_SYSTEM.md) - Access control details  
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Test credentials and verification
- [CHANGES_SUMMARY.md](./CHANGES_SUMMARY.md) - Recent updates and improvements

## 📝 Troubleshooting
- If tool inactive, ensure service is running and `health` endpoint returns `{ active: true }`.
- Check logs: `console.info` messages in each service and frontend devtools console.
- If Mongo fails, confirm `mongo` is listening and connection URI is correct.
