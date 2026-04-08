# Microservice Tool Platform (React + Express + MongoDB)

This repository provides a starter full-stack microservices architecture with a React dashboard, Node.js/Express API gateway, and multiple tool microservices.

## Project structure

- `backend/api-gateway` - main REST endpoint that lists tools, checks tool health, and proxies requests.
- `backend/tool-service-1` to `backend/tool-service-5` - independent tool microservices with own ports and REST routes.
- `frontend` - React SPA with dashboard and dynamic tool UI.

> Note: MongoDB integration is scaffolded by placeholder here with note. Each microservice can add MongoDB operations in their own `index.js`.

---

## Prerequisites

- Node.js 20+ (or 18+)
- npm
- Git
- (Optional) Docker for local MongoDB

---

## Codespaces setup

1. Open this repository in GitHub Codespaces.
2. In a terminal, go to service folders and install dependencies:
   - `cd backend/api-gateway && npm install`
   - `cd ../tool-service-1 && npm install`
   - `cd ../tool-service-2 && npm install`
   - `cd ../tool-service-3 && npm install`
   - `cd ../tool-service-4 && npm install`
   - `cd ../tool-service-5 && npm install`
   - `cd /workspaces/Microservce_tool/frontend && npm install`
3. (Optional) Start MongoDB in Codespaces:
   - `docker run -d -p 27017:27017 --name mongo mongo:latest`

---

## Run microservices

Open several terminals, one for each service.

- API gateway: `cd backend/api-gateway && npm start` (port 5000)
- Translator: `cd backend/tool-service-1 && npm start` (port 5001)
- Summarizer: `cd backend/tool-service-2 && npm start` (port 5002)
- Sentiment: `cd backend/tool-service-3 && npm start` (port 5003)
- Calculator: `cd backend/tool-service-4 && npm start` (port 5004)
- Image generator: `cd backend/tool-service-5 && npm start` (port 5005)

Run frontend:

- `cd frontend && npm start` (port 3000)

---

## Behavior

- Dashboard loads tool list from API gateway `/api/tools`.
- Clicking a tool calls `/api/tools/:id/status`.
- If inactive, user sees message to contact support.
- If active, user gets tool input UI.
- Submit sends request to `/api/tools/:id/process`.
- API gateway proxies to specific tool microservice.
- Response shown in UI.

---

## Extending tools

To add a new tool microservice:

1. Copy an existing tool folder (`backend/tool-service-5`) to `backend/tool-service-6`.
2. Update `index.js` logic and port, e.g., `PORT=5006`, `toolId='new-tool'`.
3. Add entry in `backend/api-gateway/index.js` `tools` list with new id/port.
4. Restart API gateway.
5. Add optional MongoDB data persistence in that new service:
   - install `mongoose` and connect to `mongodb://localhost:27017/<dbname>`.

To add more tools in frontend list, backend API gateway source is canonical; front-end reads all from `/api/tools`.

---

## MongoDB notes

- Each tool service may add `mongodb`/`mongoose` and maintain own collections.
- Example:
  - `npm install mongoose`
  - in `index.js`, connect with `mongoose.connect('mongodb://localhost:27017/tools')`
  - define tool-specific schemas.

## Support

If a tool stays inactive, reach out to support@example.com and verify both microservice and API gateway processes are running.

---

## Deployment, architecture and diagrams

See [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- frameworks + tools used
- full clone/install/run steps for new machine
- Docker/MongoDB setup
- production hints and adding more tool microservices

See [docs/diagrams/system_architecture.md](./docs/diagrams/system_architecture.md), [docs/diagrams/class_diagram.md](./docs/diagrams/class_diagram.md), and [docs/diagrams/sequence_diagram.md](./docs/diagrams/sequence_diagram.md) for:
- system architecture diagram
- class/component diagram
- sequence diagram


