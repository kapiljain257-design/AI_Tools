# TDA AI NEXUS - Microservice Tool Platform (React + Express + MongoDB)

A full-stack microservices architecture providing a React dashboard for AI-powered tools with Node.js/Express API gateway and multiple specialized microservices.

## Project Structure

### Backend
- `backend/api-gateway/` - Main REST API endpoint for tool listing, health checks, and request proxying
- `backend/nova/` - Advanced text processing and translation microservice
- `backend/image-generator/` - AI-powered image generation microservice
- `backend/indus-report/` - Comprehensive reporting and data analysis microservice
- `backend/perfectto/` - Quality assurance and content optimization microservice
- `backend/repro-tool/` - Reproduction and issue tracking microservice

### Frontend
- `frontend/` - React SPA (18.3.1) with modular component architecture
  - `src/components/common/` - Reusable components (Header, LoginModal, TeamInfo)
  - `src/components/pages/` - Page-level components (Dashboard, ToolInterface, Feedback, About)
  - `src/components/tools/` - **Tool-specific interface components** (organized by tool ID)
    - `nova/NovaInterface.js` - Text processing UI with mode selector
    - `image-generator/ImageGeneratorInterface.js` - Image generation with URL detection
    - `indus-report/IndustReportInterface.js` - Report type selector and data input
    - `perfectto/PerfectoInterface.js` - Content optimization interface
    - `repro-tool/ReproToolInterface.js` - Issue tracking and report submission

> Each microservice can implement MongoDB operations via Mongoose in their own `index.js`

---

## Quick Start

### Prerequisites
- Node.js 20+ (or 18+)
- npm
- Git
- (Optional) Docker for local MongoDB

### Setup & Installation

1. Clone repository:
   ```bash
   git clone https://github.com/kapiljain257-design/AI_Tools.git
   cd AI_Tools
   ```

2. Install dependencies for all services:
   ```bash
   cd backend/api-gateway && npm install
   cd ../nova && npm install
   cd ../image-generator && npm install
   cd ../indus-report && npm install
   cd ../perfectto && npm install
   cd ../repro-tool && npm install
   cd ../../frontend && npm install
   ```

3. (Optional) Start MongoDB in Docker:
   ```bash
   docker run -d -p 27017:27017 --name mongo mongo:latest
   ```

### Running the Application

Open multiple terminal windows or tabs, one for each service:

**Backend Services:**
```bash
# Terminal 1: API Gateway
cd backend/api-gateway && npm start         # Port 5000

# Terminal 2: Nova Tool
cd backend/nova && npm start                # Port 5001

# Terminal 3: Image Generator Tool
cd backend/image-generator && npm start     # Port 5002

# Terminal 4: Indus Report Tool
cd backend/indus-report && npm start        # Port 5003

# Terminal 5: Perfectto Tool
cd backend/perfectto && npm start           # Port 5004

# Terminal 6: Repro Tool
cd backend/repro-tool && npm start          # Port 5005
```

**Frontend:**
```bash
# Terminal 7: React Frontend
cd frontend && npm start                    # Port 3000
```

The application will be available at `http://localhost:3000`

---

## Available Tools

| Tool | Purpose | Port |
|------|---------|------|
| **Nova** | Advanced text processing, summarization, and translation | 5001 |
| **Image Generator** | AI-powered image generation from text descriptions | 5002 |
| **Indus Report** | Comprehensive reporting and data analysis system | 5003 |
| **Perfectto** | Quality assurance and content optimization | 5004 |
| **Repro Tool** | Reproduction/issue tracking and framework automation | 5005 |

---

## Architecture & Behavior

### Request Flow
1. **Dashboard**: React frontend loads available tools from API Gateway `/api/tools/filtered` (filtered by user permissions)
2. **Tool Selection**: Clicking a tool checks status via `/api/tools/:id/status`
3. **Status Check**: 
   - If active: User receives tool-specific UI
   - If inactive: User sees maintenance message with support contact
4. **Processing**: Submit sends request to `/api/tools/:id/process`
5. **Proxy**: API Gateway proxies request to appropriate microservice
6. **Response**: Result displayed in tool-specific interface component

### Component Architecture
- **Generic Flow**: App.js → ToolInterface.js → Conditional routing
- **Tool-Specific Components**: Located in `/components/tools/{toolId}/`
  - Each tool has its own interface component with customized UI
  - Consistent props interface for state management
  - Tool-specific labels, controls, and input types

---

## Permission-Based Access Control

The platform implements user groups to control tool access. See [PERMISSION_SYSTEM.md](./PERMISSION_SYSTEM.md) for details.

### User Groups
- `qipl.nova.users` - Nova tool access
- `qipl.indus.users` - Indus Report access
- `qipl.perfectto.users` - Perfectto access
- `qipl.repro.users` - Repro Tool access
- `qipl.tda.developers` - Super admin (all tools)

### How It Works
1. Users log in with email, password, and API key
2. Frontend automatically assigns groups based on email keywords
3. Only tools matching user's groups appear in dashboard
4. Backend validates permissions on each request

---

## Extending the Platform

### Adding a New Tool Microservice
1. Create new folder: `backend/new-tool/`
2. Copy structure from existing tool (e.g., `backend/nova/`)
3. Update `index.js`:
   - Set unique port (e.g., 5006)
   - Update `toolId` to match folder name
   - Implement tool-specific logic
4. Add tool definition to `backend/api-gateway/constants.js`
5. Create tool-specific React component in `frontend/src/components/tools/{toolId}/`
6. Restart API Gateway

### Adding a New User Group
1. Update `backend/api-gateway/constants.js` with new group
2. Update `frontend/src/constants.js` to match
3. Add tools to new group's `requiredGroups` array
4. Restart services

---

## MongoDB Integration

Each microservice can implement data persistence:

1. Install mongoose:
   ```bash
   npm install mongoose
   ```

2. In `index.js`, add connection:
   ```javascript
   const mongoose = require('mongoose');
   mongoose.connect('mongodb://localhost:27017/nova-db');
   ```

3. Define tool-specific schemas and models

---

## Support & Troubleshooting

**Issue**: Tool shows as inactive
- Verify the tool microservice is running on correct port
- Check API Gateway is accessible on port 5000
- Verify network connectivity between services

**Issue**: Tools not visible in dashboard
- Confirm user has appropriate group permissions
- Check backend/api-gateway/constants.js tool definitions
- Verify browser localStorage doesn't have stale data (clear and reload)

**Issue**: API Gateway connection errors
- Ensure API Gateway started first (dependencies on it)
- Check no other process using port 5000
- Test with: `curl http://localhost:5000/api/tools`

**Support Contact**: support@example.com

---

## Documentation

For comprehensive documentation, visit the **[docs/](./docs/)** folder:

### 📚 Quick Links
- **[docs/INDEX.md](./docs/INDEX.md)** - Complete documentation index and navigation
- **[docs/INSTALLATION_GUIDE.md](./docs/INSTALLATION_GUIDE.md)** - Detailed setup instructions
- **[docs/DATABASE.md](./docs/DATABASE.md)** - MongoDB schemas, queries, and database setup
- **[docs/WEBSITE_TESTING_GUIDE.md](./docs/WEBSITE_TESTING_GUIDE.md)** - Feature testing checklist and examples
- **[docs/QUICK_REFERENCE.md](./docs/QUICK_REFERENCE.md)** - Common commands and debugging
- **[docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Production deployment guide
- **[docs/IMPLEMENTATION_SUMMARY.md](./docs/IMPLEMENTATION_SUMMARY.md)** - Feature overview and status
- **[docs/PERMISSION_SYSTEM.md](./docs/PERMISSION_SYSTEM.md)** - User groups and access control
- **[docs/TESTING_GUIDE.md](./docs/TESTING_GUIDE.md)** - Automated testing procedures
- **[docs/diagrams/](./docs/diagrams/)** - System architecture diagrams

**New to the project?** Start with [docs/INDEX.md](./docs/INDEX.md) for guided navigation!


