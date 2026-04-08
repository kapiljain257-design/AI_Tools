# Deployment and Tech Stack Reference

## 🧩 What is included
- Frontend: React (Create React App)
- Backend gateway: Node.js + Express
- Tool microservices: Node.js + Express (each independent)
- Data store: MongoDB (each microservice can connect via Mongoose)
- API proxy/routing: API gateway (`/api/tools`, `/api/tools/:id/status`, `/api/tools/:id/process`)

## 🛠️ Frameworks and tools in use
- Node.js (Express) for all backend services
- React in frontend (CRA scaffold)
- MongoDB for persistence
- mongoose for MongoDB ORM (declared in microservice packages)
- cors, body-parser for API body parsing and cross-origin support

## 🔢 Ports (default)
- API gateway: `5000`
- tool-service-1 (translator): `5001`
- tool-service-2 (summarizer): `5002`
- tool-service-3 (sentiment): `5003`
- tool-service-4 (calculator): `5004`
- tool-service-5 (image-generator): `5005`
- frontend: `3000`

## 📦 Deploy this on another machine

### 1) Clone repository
```bash
git clone https://github.com/kapilsankhlecha/Microservce_tool.git
cd Microservce_tool
```

### 2) Install runtime prerequisites
- Node.js 18+ (recommended 20+)
- npm
- MongoDB (local or hosted)

#### Local MongoDB (Linux example)
```bash
sudo apt update
sudo apt install -y mongodb
sudo systemctl enable mongod --now
```

#### Docker MongoDB (cross-platform)
```bash
docker run -d --name microservce-mongo -p 27017:27017 mongo:latest
```

### 3) Install dependencies
```bash
cd backend/api-gateway && npm install
cd ../tool-service-1 && npm install
cd ../tool-service-2 && npm install
cd ../tool-service-3 && npm install
cd ../tool-service-4 && npm install
cd ../tool-service-5 && npm install
cd ../../frontend && npm install
```

### 4) Configure environment
- Optional env var for MongoDB: `MONGODB_URI`, e.g.: 
  `mongodb://localhost:27017/microservice_tools`
- API gateway port override: `PORT` (default 5000)
- Tool service ports: configured in each service `index.js` or via `PORT`

### 5) Start backend microservices
In multiple terminals or use a process manager (pm2/tmux):
```bash
cd backend/api-gateway && npm start
cd backend/tool-service-1 && npm start
cd backend/tool-service-2 && npm start
cd backend/tool-service-3 && npm start
cd backend/tool-service-4 && npm start
cd backend/tool-service-5 && npm start
```

### 6) Start frontend
```bash
cd frontend && npm start
```

### 7) Verify
- `curl http://localhost:5000/api/tools`
- `curl http://localhost:5000/api/tools/translator/status`
- `curl -X POST http://localhost:5000/api/tools/translator/process -H "Content-Type: application/json" -d '{"prompt":"hello"}'`

### 8) Optional production deployment (recommended)
- Build frontend: `cd frontend && npm run build`
- Serve static files via Nginx for production
- Use process manager for Node services: `pm2 start index.js --name api-gateway`, etc.

## ➕ Adding new tools later
1. Copy `backend/tool-service-5` to a new folder `backend/tool-service-6` (or named for its role).
2. Update `index.js` in new microservice: toolId, port, processing logic.
3. Add to API gateway `tools` list (`backend/api-gateway/index.js`).
4. Restart API gateway + new microservice.
5. UI will list it from `/api/tools` automatically.

## 📝 Troubleshooting
- If tool inactive, ensure service is running and `health` endpoint returns `{ active: true }`.
- Check logs: `console.info` messages in each service and frontend devtools console.
- If Mongo fails, confirm `mongo` is listening and connection URI is correct.
