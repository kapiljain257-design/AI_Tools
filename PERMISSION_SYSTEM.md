# Permission-Based Access Control System

## Overview
The TDA AI NEXUS platform now implements a permission-based access control system using user groups/lists. Users can only access tools for which they have the appropriate group membership.

## User Groups (Enums)

Located in: `backend/api-gateway/constants.js`

```javascript
const USER_GROUPS = {
  NOVA_USERS: 'qipl.nova.users',
  INDUS_USERS: 'qipl.indus.users',
  PERFECTTO_USERS: 'qipl.perfectto.users',
  REPRO_USERS: 'qipl.repro.users',
  TDA_DEVELOPERS: 'qipl.tda.developers'  // Super admin - can access all tools
};
```

### Adding/Modifying User Groups
1. Edit `/backend/api-gateway/constants.js`
2. Add new groups to the `USER_GROUPS` object
3. Restart the API Gateway server

## Tool Configuration

### Tool Mapping
Each tool is mapped to required user groups. Located in: `backend/api-gateway/constants.js`

Example:
```javascript
{
  id: 'nova',
  name: 'Nova',
  port: 5001,
  description: 'Advanced text processing and translation tool',
  requiredGroups: [USER_GROUPS.NOVA_USERS, USER_GROUPS.TDA_DEVELOPERS]
}
```

### Current Tool List
1. **Nova** - Advanced text processing and translation
   - Groups: `qipl.nova.users`, `qipl.tda.developers`

2. **Indus Report** - Comprehensive reporting and data analysis
   - Groups: `qipl.indus.users`, `qipl.tda.developers`

3. **Perfectto** - Quality assurance and optimization tool
   - Groups: `qipl.perfectto.users`, `qipl.tda.developers`

4. **Repro Tool** - Reproduction and testing framework
   - Groups: `qipl.repro.users`, `qipl.tda.developers`

5. **Image Generator** - AI-powered image and visual content generation
   - Groups: `qipl.tda.developers` (only)

## How It Works

### Frontend Flow
1. User logs in with email, password, and API key
2. The `handleLogin` function in `App.js` automatically assigns groups based on email patterns
3. Groups are stored in localStorage and state
4. When fetching tools, the frontend calls `/api/tools/filtered` with the user's groups
5. Only tools matching user groups are displayed

### Backend Flow
1. Frontend sends POST request to `/api/tools/filtered` with user groups
2. API Gateway filters tools based on `requiredGroups`
3. Returns only tools the user has access to

## Customization Guide

### Adding a New Tool
1. **Update Backend Constants** (`backend/api-gateway/constants.js`):
   ```javascript
   {
     id: 'new-tool',
     name: 'New Tool',
     port: 5006,
     description: 'Description of new tool',
     requiredGroups: [USER_GROUPS.NOVA_USERS, USER_GROUPS.TDA_DEVELOPERS]
   }
   ```

2. **Start the tool service** on the specified port (5006 in this example)

3. **Frontend automatically updates** - no changes needed

### Adding a New User Group
1. Edit `backend/api-gateway/constants.js`:
   ```javascript
   const USER_GROUPS = {
     // ... existing groups
     NEW_GROUP: 'qipl.new.users'
   };
   ```

2. Update tools to use this group in their `requiredGroups`

3. Update Frontend: Edit `frontend/src/constants.js` to match:
   ```javascript
   export const USER_GROUPS = {
     // ... existing groups
     NEW_GROUP: 'qipl.new.users'
   };
   ```

4. Update `frontend/src/App.js` `handleLogin` function to assign users to this group based on your logic

### Modifying User Group Assignment Logic
Currently, groups are assigned based on email patterns in `frontend/src/App.js`:

```javascript
// In handleLogin function
if (email.includes('nova')) {
  assignedGroups.push(USER_GROUPS.NOVA_USERS);
}
```

**For production**, replace this with a backend call:
```javascript
// Fetch user groups from backend based on email/user ID
const response = await fetch('/api/user/groups', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email })
});
const { groups } = await response.json();
setUserGroups(groups);
```

## Backend Folder Renaming

The backend service folders should be renamed to match tool names:

```
backend/
├── api-gateway/
├── nova/                    (was tool-service-1)
├── indus-report/            (was tool-service-2)
├── perfectto/               (was tool-service-3)
├── repro-tool/              (was tool-service-4)
└── image-generator/         (was tool-service-5)
```

### How to Rename:
```bash
# Navigate to backend directory
cd backend

# Rename folders
mv tool-service-1 nova
mv tool-service-2 indus-report
mv tool-service-3 perfectto
mv tool-service-4 repro-tool
mv tool-service-5 image-generator
```

## Testing the Permission System

### Test Case 1: Nova User
- Email: `nova-user@company.com` (contains "nova")
- Expected Access: Nova tool only
- Expected Groups: `['qipl.nova.users']`

### Test Case 2: Multi-Group User
- Email: `nova-indus-user@company.com` (contains both "nova" and "indus")
- Expected Access: Nova and Indus Report tools
- Expected Groups: `['qipl.nova.users', 'qipl.indus.users']`

### Test Case 3: Admin User
- Email: `admin-tda@company.com` (contains "tda")
- Expected Access: All tools
- Expected Groups: `['qipl.tda.developers']`

## API Endpoints

### Get All Tools
```
GET /api/tools
Response: { tools: [...all tools...] }
```

### Get Filtered Tools (User-Specific)
```
POST /api/tools/filtered
Body: { userGroups: ['qipl.nova.users', 'qipl.indus.users'] }
Response: { tools: [...filtered tools...] }
```

### Check Tool Status
```
GET /api/tools/{id}/status
Response: { active: boolean }
```

### Process Tool Request
```
POST /api/tools/{id}/process
Body: { type: 'text' | 'image', prompt: string }
Response: { result: string }
```

## Future Enhancements

1. **Backend Integration**: Replace email-based group assignment with actual backend directory/group lookup
2. **Dynamic Tool Discovery**: Load tool metadata from a database instead of hardcoded constants
3. **Role-Based Access Control (RBAC)**: Add support for roles in addition to groups
4. **Audit Logging**: Log which user accessed which tool for compliance
5. **Permission Caching**: Cache user permissions to reduce backend calls
