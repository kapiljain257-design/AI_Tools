# Installation and Setup Guide for TDA AI NEXUS

This guide provides step-by-step instructions to set up the TDA AI NEXUS microservice dashboard on your local machine.

## Prerequisites

Before installing the application, ensure you have the following software installed on your system:

### 1. Node.js and npm
- **Version Required**: Node.js 16.x or higher, npm 7.x or higher
- **Download**: Visit [nodejs.org](https://nodejs.org/) and download the LTS version
- **Verification**:
  ```bash
  node --version
  npm --version
  ```

### 2. MongoDB
- **Version Required**: MongoDB 4.4 or higher
- **Installation Options**:
  - **Option A: MongoDB Community Server**
    - Download from [mongodb.com](https://www.mongodb.com/try/download/community)
    - Follow the installation instructions for your operating system
  - **Option B: MongoDB Atlas (Cloud)**
    - Create a free account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
    - Create a cluster and get the connection string
- **Verification**:
  ```bash
  mongod --version
  ```

### 3. Git (Optional)
- Required if cloning the repository
- Download from [git-scm.com](https://git-scm.com/)

## Project Structure

```
AI_Tools/
├── frontend/          # React frontend application
├── backend/           # Microservices backend
│   ├── api-gateway/   # API Gateway service (port 5000)
│   ├── image-generator/ # Image generation service (port 5005)
│   ├── indus-report/  # Indus report service (port 5002)
│   ├── nova/          # Nova service (port 5001)
│   ├── perfectto/     # Perfectto service (port 5003)
│   └── repro-tool/    # Repro tool service (port 5004)
└── docs/             # Documentation
```

## Installation Steps

### 1. Clone or Download the Repository
```bash
git clone https://github.com/kapiljain257-design/AI_Tools.git
cd AI_Tools
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

### 3. Install Backend Dependencies
Install dependencies for each microservice:

```bash
# API Gateway
cd backend/api-gateway
npm install
cd ../..

# Image Generator
cd backend/image-generator
npm install
cd ../..

# Indus Report
cd backend/indus-report
npm install
cd ../..

# Nova
cd backend/nova
npm install
cd ../..

# Perfectto
cd backend/perfectto
npm install
cd ../..

# Repro Tool
cd backend/repro-tool
npm install
cd ../..
```

### 4. Configure MongoDB
- Ensure MongoDB is running on your system
- Default connection: `mongodb://localhost:27017/microservice_tools`
- If using MongoDB Atlas, update the `MONGODB_URI` environment variable in `backend/shared/toolConfig.js` or in the service-specific `.env` file
- The default Python executable is `python3`; override it with `PYTHON_EXECUTABLE=python` or the full path to your Python interpreter if needed

### 5. Start the Services

#### Option A: Manual Startup (Recommended for Development)
Open separate terminal windows and start each service:

```bash
# Terminal 1: API Gateway
cd backend/api-gateway
npm start

# Terminal 2: Nova Service
cd backend/nova
npm start

# Terminal 3: Indus Report Service
cd backend/indus-report
npm start

# Terminal 4: Perfectto Service
cd backend/perfectto
npm start

# Terminal 5: Repro Tool Service
cd backend/repro-tool
npm start

# Terminal 6: Image Generator Service
cd backend/image-generator
npm start

# Terminal 7: Frontend
cd frontend
npm start
```

#### Option B: Using a Process Manager (PM2)
Install PM2 globally:
```bash
npm install -g pm2
```

Create an ecosystem file `ecosystem.config.js` in the root directory:
```javascript
module.exports = {
  apps: [
    {
      name: 'api-gateway',
      script: 'backend/api-gateway/index.js',
      cwd: '.'
    },
    {
      name: 'nova',
      script: 'backend/nova/index.js',
      cwd: '.'
    },
    {
      name: 'indus-report',
      script: 'backend/indus-report/index.js',
      cwd: '.'
    },
    {
      name: 'perfectto',
      script: 'backend/perfectto/index.js',
      cwd: '.'
    },
    {
      name: 'repro-tool',
      script: 'backend/repro-tool/index.js',
      cwd: '.'
    },
    {
      name: 'image-generator',
      script: 'backend/image-generator/index.js',
      cwd: '.'
    },
    {
      name: 'frontend',
      script: 'npm start',
      cwd: './frontend'
    }
  ]
};
```

Start all services:
```bash
pm2 start ecosystem.config.js
```

## Access the Application

Once all services are running:
- Frontend: http://localhost:3001
- API Gateway: http://localhost:5000
- Individual Services: http://localhost:5001-5005

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   - Ensure ports 3001, 5000-5005 are available
   - Change ports in service configuration if needed

2. **MongoDB Connection Issues**
   - Verify MongoDB is running: `sudo systemctl status mongod` (Linux)
   - Check connection string in `backend/image-generator/index.js`

3. **npm Install Failures**
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall

4. **CORS Issues**
   - Ensure all backend services have CORS enabled
   - Check browser console for CORS errors

### Service Health Checks

Test individual services:
```bash
curl http://localhost:5000/api/tools
curl http://localhost:5001/health
curl http://localhost:5002/health
# ... etc for other services
```

## Development

- Frontend hot-reload: Changes in `frontend/src/` automatically refresh
- Backend services: Restart required for code changes
- Theme switching: Toggle between light/dark themes in the UI

## Support

For issues or questions:
- Email: support@example.com
- Check the logs in each service terminal for error messages