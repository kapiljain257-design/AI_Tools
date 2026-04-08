# Tool Names and User Access Matrix

## Tool Information

| Tool Name | Tool ID | Port | Description | Required Groups |
|-----------|---------|------|-------------|-----------------|
| Nova | nova | 5001 | Advanced text processing and translation | nova-users, tda-developers |
| Indus Report | indus-report | 5002 | Comprehensive reporting and data analysis | indus-users, tda-developers |
| Perfectto | perfectto | 5003 | Quality assurance and optimization tool | perfectto-users, tda-developers |
| Repro Tool | repro-tool | 5004 | Reproduction and testing framework | repro-users, tda-developers |
| Image Generator | image-generator | 5005 | AI-powered image and visual content generation | tda-developers only |

## User Group List

```
NOVA_USERS = 'qipl.nova.users'
INDUS_USERS = 'qipl.indus.users'
PERFECTTO_USERS = 'qipl.perfectto.users'
REPRO_USERS = 'qipl.repro.users'
TDA_DEVELOPERS = 'qipl.tda.developers'  # Admin/Super User - Access to ALL tools
```

## Test User List for Verification

Use these email addresses to test different tool access levels. **Password and API Key can be anything.**

### Single Tool Access Users

| Email | Groups Assigned | Tools Accessible |
|-------|----------------|------------------|
| `nova.user@company.com` | `[qipl.nova.users]` | Nova only |
| `indus.user@company.com` | `[qipl.indus.users]` | Indus Report only |
| `perfectto.user@company.com` | `[qipl.perfectto.users]` | Perfectto only |
| `repro.user@company.com` | `[qipl.repro.users]` | Repro Tool only |

### Multi-Tool Access Users

| Email | Groups Assigned | Tools Accessible |
|-------|----------------|------------------|
| `nova.indus@company.com` | `[qipl.nova.users, qipl.indus.users]` | Nova + Indus Report |
| `nova.perfectto@company.com` | `[qipl.nova.users, qipl.perfectto.users]` | Nova + Perfectto |
| `nova.repro@company.com` | `[qipl.nova.users, qipl.repro.users]` | Nova + Repro Tool |
| `indus.perfectto@company.com` | `[qipl.indus.users, qipl.perfectto.users]` | Indus Report + Perfectto |
| `indus.repro@company.com` | `[qipl.indus.users, qipl.repro.users]` | Indus Report + Repro Tool |
| `perfectto.repro@company.com` | `[qipl.perfectto.users, qipl.repro.users]` | Perfectto + Repro Tool |

### Admin/Super User Access

| Email | Groups Assigned | Tools Accessible |
|-------|----------------|------------------|
| `admin@tda.company.com` | `[qipl.tda.developers]` | ALL TOOLS |
| `superuser@tda.company.com` | `[qipl.tda.developers]` | ALL TOOLS |
| `developer@tda.company.com` | `[qipl.tda.developers]` | ALL TOOLS |

### Mixed Access (Regular + Admin)

| Email | Groups Assigned | Tools Accessible |
|-------|----------------|------------------|
| `nova.admin@tda.company.com` | `[qipl.nova.users, qipl.tda.developers]` | ALL TOOLS |
| `indus.admin@tda.company.com` | `[qipl.indus.users, qipl.tda.developers]` | ALL TOOLS |
| `multi.admin@tda.company.com` | `[qipl.nova.users, qipl.indus.users, qipl.tda.developers]` | ALL TOOLS |

### Default Access Users

| Email | Groups Assigned | Tools Accessible |
|-------|----------------|------------------|
| `generic.user@company.com` | `[qipl.nova.users]` (default) | Nova only |
| `unknown@company.com` | `[qipl.nova.users]` (default) | Nova only |
| `test@company.com` | `[qipl.nova.users]` (default) | Nova only |

## How Group Assignment Works

The system automatically assigns groups based on email keywords:

- **nova** → `qipl.nova.users`
- **indus** → `qipl.indus.users`
- **perfectto** → `qipl.perfectto.users`
- **repro** → `qipl.repro.users`
- **tda** or **admin** → `qipl.tda.developers`

If no keywords match, the user gets default access to Nova tools.

## Testing Instructions

1. **Start the app**:
   ```bash
   cd frontend
   npm start
   ```

2. **Click "Login"** when the modal appears

3. **Enter credentials**:
   - Use any of the emails from the table above
   - Password: `any_password`
   - API Key: `any_api_key`

4. **Verify tool access**:
   - Check which tools appear in the dashboard
   - Compare with the "Tools Accessible" column in the table

5. **Test navigation**:
   - Click the "TDA AI NEXUS" title to return home
   - Try Feedback and About Us buttons
   - Test theme toggle and logout

## Expected Results

- **Nova user** (`nova.user@company.com`) should see only the Nova tool
- **Indus user** (`indus.user@company.com`) should see only Indus Report
- **Admin user** (`admin@tda.company.com`) should see all 5 tools
- **Multi-tool user** (`nova.indus@company.com`) should see Nova and Indus Report

## Troubleshooting

If tools don't appear as expected:
1. Check browser console for errors
2. Verify the backend API gateway is running (`npm start` in `backend/api-gateway/`)
3. Check that tool services are running on their respective ports
4. Clear browser cache and localStorage if needed
```
Email: multi.user@nova-indus.company.com
Password: any_password
API Key: any_api_key

Login Result:
✓ Groups Assigned: [qipl.nova.users, qipl.indus.users]
✓ Tools Accessible: Nova, Indus Report
```

### Example 4: Perfectto User
```
Email: perfectto.specialist@company.com
Password: any_password
API Key: any_api_key

Login Result:
✓ Groups Assigned: [qipl.perfectto.users]
✓ Tools Accessible: Perfectto
```

### Example 5: Repro Tool User
```
Email: repro.engineer@company.com
Password: any_password
API Key: any_api_key

Login Result:
✓ Groups Assigned: [qipl.repro.users]
✓ Tools Accessible: Repro Tool
```

### Example 6: TDA Admin/Developer (All Tools)
```
Email: admin@tda.company.com
Password: any_password
API Key: any_api_key

Login Result:
✓ Groups Assigned: [qipl.tda.developers]
✓ Tools Accessible: All Tools (Nova, Indus Report, Perfectto, Repro Tool, Image Generator)
```

### Example 7: Multiple Groups + Admin (All Tools)
```
Email: nova-admin@tda.company.com
Password: any_password
API Key: any_api_key

Login Result:
✓ Groups Assigned: [qipl.nova.users, qipl.tda.developers]
✓ Tools Accessible: All Tools (tda.developers overrides limits)
```

### Example 8: User with No Match (Default Access)
```
Email: generic.user@company.com
Password: any_password
API Key: any_api_key

Login Result:
✓ Groups Assigned: [qipl.nova.users] (default)
✓ Tools Accessible: Nova
```

## Password and API Key Notes

The current implementation accepts **any non-empty** password and API key for testing purposes. 

For production, you should:
1. Implement proper authentication on the backend
2. Call a backend endpoint to verify credentials
3. Get the user's actual groups from the backend (not based on email patterns)

## How to Test

1. Build and start the app:
   ```bash
   cd frontend
   npm start
   ```

2. Click "Login" when the modal appears

3. Enter one of the example credentials above

4. Observe which tools appear based on the user's assigned groups

5. Try logging out and logging in with a different email to see different tools

## Modifying the Assignment Logic

To change how groups are assigned, edit `frontend/src/App.js` in the `handleLogin` function:

```javascript
// Current implementation (line ~110-130)
let assignedGroups = [];
if (email.includes('nova')) {
  assignedGroups.push(USER_GROUPS.NOVA_USERS);
}
if (email.includes('indus')) {
  assignedGroups.push(USER_GROUPS.INDUS_USERS);
}
// ... etc
```

You can replace this with:
- Backend API call to get user groups
- Database lookup
- LDAP/Active Directory integration
- Any other authentication provider
