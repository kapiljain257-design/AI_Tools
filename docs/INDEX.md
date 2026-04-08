# 📚 TDA AI NEXUS Documentation

Welcome to the comprehensive documentation for the TDA AI NEXUS platform! This folder contains all project documentation organized by topic.

## 📖 Documentation Index

### 🚀 Getting Started
- **[INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)** - Step-by-step installation and setup instructions for all services
- **[README.md](../README.md)** - Project overview and quick reference (in root)

### 💻 Development & Deployment
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guidelines and configurations
- **[BACKEND_RENAMING_GUIDE.md](./BACKEND_RENAMING_GUIDE.md)** - Backend service structure and naming conventions

### 📊 Database & Data
- **[DATABASE.md](./DATABASE.md)** - Complete MongoDB schema documentation, queries, and setup guide
  - Collections: users, login_sessions, tool_usage, tool_status_history, execution_logs, user_statistics
  - How to connect locally and remotely
  - Common queries and export procedures

### 🧪 Testing & Quality Assurance
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Automated testing procedures and test scenarios
- **[WEBSITE_TESTING_GUIDE.md](./WEBSITE_TESTING_GUIDE.md)** - Complete feature testing checklist with examples
  - Feature-by-feature testing instructions
  - Example tool executions and expected outputs
  - Troubleshooting common issues
  - Success criteria for deployment

### 📋 Reference Guides
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Quick reference for common commands
  - MongoDB quick commands
  - API endpoint testing with cURL
  - Backend service logs
  - Performance monitoring
  - Maintenance commands

- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Feature overview and current system status
  - All features implemented
  - What gets saved in database
  - Example requests/responses
  - Key files modified

### 🔐 System Configuration
- **[PERMISSION_SYSTEM.md](./PERMISSION_SYSTEM.md)** - User groups and access control system
  - User group definitions
  - Tool access permissions
  - Group assignment rules

### 📝 Project Management
- **[CHANGES_SUMMARY.md](./CHANGES_SUMMARY.md)** - Summary of recent changes and updates

---

## 🎯 Quick Navigation

### For Users
1. Start with [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)
2. Check [WEBSITE_TESTING_GUIDE.md](./WEBSITE_TESTING_GUIDE.md) for feature overview
3. Use [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for common tasks

### For Developers
1. Read [BACKEND_RENAMING_GUIDE.md](./BACKEND_RENAMING_GUIDE.md) for architecture
2. Check [DATABASE.md](./DATABASE.md) for data structures
3. Use [TESTING_GUIDE.md](./TESTING_GUIDE.md) for testing procedures
4. Refer to [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup

### For DevOps/SRE
1. Start with [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Review [DATABASE.md](./DATABASE.md) for backup/restore
3. Check [PERMISSION_SYSTEM.md](./PERMISSION_SYSTEM.md) for access control
4. Use [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for monitoring commands

---

## 📌 Key Documents Summary

| Document | Purpose | Audience |
|----------|---------|----------|
| DATABASE.md | MongoDB schemas, queries, setup | Developers, DevOps |
| WEBSITE_TESTING_GUIDE.md | Testing procedures and checklist | QA, Developers, Users |
| QUICK_REFERENCE.md | Common commands and debugging | All |
| IMPLEMENTATION_SUMMARY.md | Feature status and overview | Project Managers, Developers |
| PERMISSION_SYSTEM.md | Access control and user groups | DevOps, Security |
| DEPLOYMENT.md | Production setup and configuration | DevOps, System Admin |
| INSTALLATION_GUIDE.md | Initial setup and installation | Developers, DevOps |
| TESTING_GUIDE.md | Automated testing framework | QA, Developers |

---

## 🌐 System Access

**Website URL:** http://localhost:3001

**Test Credentials:**
- Email: `admin@tda.com` (all tools access)
- Password: anything
- API Key: anything

**Database:** `mongodb://localhost:27017/microservice_tools`

**API Gateway:** `http://localhost:5000`

---

## 🚀 Quick Start Command

```bash
# From project root
npm start  # Starts all services
# Frontend: http://localhost:3001
# Backend: http://localhost:5000
```

---

## 📞 Support

For detailed information on any topic, refer to the specific documentation file listed above. 

For questions or issues:
1. Check [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for troubleshooting
2. Review [WEBSITE_TESTING_GUIDE.md](./WEBSITE_TESTING_GUIDE.md) for common issues
3. Consult [DATABASE.md](./DATABASE.md) for data-related questions

---

**Last Updated:** April 8, 2026
**Status:** ✅ All Services Running
