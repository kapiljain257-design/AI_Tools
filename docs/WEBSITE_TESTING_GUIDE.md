# TDA AI NEXUS - Complete Testing & Usage Guide

## 🚀 Quick Start - Website Access

### Access the Website
Open your browser and navigate to:
```
http://localhost:3001
```

**Status:**
- ✅ Frontend: Running on port 3001
- ✅ API Gateway: Running on port 5000
- ✅ Nova (Tool 1): Running on port 5001
- ✅ Indus Report (Tool 2): Running on port 5002
- ✅ Perfectto (Tool 3): Running on port 5003
- ✅ Repro Tool (Tool 4): Running on port 5004
- ✅ Image Generator (Tool 5): Running on port 5005

---

## 📝 Feature Testing Checklist

### 1. Initial Page Load
- [ ] Page loads with initialization message
- [ ] Dark mode is applied if it was previously selected
- [ ] Header displays correctly with spacing
- [ ] Dashboard loads without errors

### 2. Authentication & Login
**Test with any email (mock authentication):**
- Email: `admin@tda.com` → Gets access to all tools (TDA_DEVELOPERS group)
- Email: `nova@user.com` → Gets Nova tool access
- Email: `indus@user.com` → Gets Indus Report access
- Password: Any value
- API Key: Any value

**Actions to test:**
- [ ] Enter credentials and click "Login"
- [ ] Page shows "logged in as" in header
- [ ] Tools list filters based on user groups
- [ ] User email appears in header

### 3. Theme Toggle
- [ ] Click moon/sun icon in header
- [ ] Theme switches between light and dark
- [ ] Theme persists after page refresh
- [ ] All UI colors update correctly

### 4. Developer Mode
**Only for admin, tda, or developers:**
- [ ] Look for developer toggle button (⚙️ icon) in header
- [ ] Toggle developer mode ON → button shows ⚙️ DEV ON in orange
- [ ] Orange border appears at top of header
- [ ] Execute logs panel appears on tool pages
- [ ] Logs show debug information

### 5. Tool Selection & Status Indicators
- [ ] Click on any tool card
- [ ] Tool opens with interface
- [ ] Top-right corner shows green dot (✓ Service Running) or red dot (✗ Service Offline)
- [ ] Status indicator updates every 5 seconds
- [ ] Status message shows "Tool is active. Enter prompt." if running

### 6. Tool Execution & Responses

#### Nova Tool (Text Processing)
```
Input: "hello world"
Expected Output: "ellohay orldway" (Pig Latin conversion)
```
- [ ] Enter text in input field
- [ ] Click submit button
- [ ] See output appear (Pig Latin converted text)
- [ ] Response time shows in milliseconds
- [ ] Execution completes with "Done" status

#### Indus Report Tool (Summarization)
```
Input: "The quick brown fox jumps over the lazy dog"
Expected Output: Truncated text (max 80 chars)
```
- [ ] Enter text
- [ ] Submit request
- [ ] See summarized output
- [ ] Status updates to "Done"

#### Perfectto Tool (Quality Check)
```
Input: "code quality check test"
Expected Output: JSON response with quality metrics
```
- [ ] Submit request
- [ ] See structured response
- [ ] Decoding works for special characters

#### Repro Tool (Testing)
```
Input: "test case scenario"
Expected Output: Test results processing
```
- [ ] Submit request
- [ ] See test framework response

#### Image Generator Tool
```
Input: "sunset over ocean"
Expected Output: Image generation response/URL
```
- [ ] Submit text prompt
- [ ] See image generation result or placeholder

### 7. Header Navigation
- [ ] **Home Button** (🏠): Returns to dashboard
- [ ] **Feedback Button** (💬): Opens feedback form
- [ ] **About Us Button** (ℹ️): Shows about/team/mission info
- [ ] **Theme Toggle** (🌙/☀️): Switches theme
- [ ] **Logout Button**: Logs out user and clears data

### 8. About Us Section (When Logged In)
- [ ] Shows "Our Mission" section with 4 cards
- [ ] Shows "Meet Our Team" section with team members
- [ ] Shows "Available Tools" section with all 5 tools
- [ ] Shows "Platform Features" section with 6 feature cards
- [ ] Shows "Your Status" section with:
  - [ ] Login status showing user email
  - [ ] Available tools count
  - [ ] Navigation tips
- [ ] Shows "Get Support" section with contact email

### 9. Feedback Form
- [ ] Enter feedback details
- [ ] Form validates all fields required
- [ ] Preview shows how message will be sent
- [ ] Submit button works (simulated)
- [ ] Success message appears

### 10. Execution Logs (Developer Mode Only)
- [ ] Logs panel shows on right side
- [ ] Logs include:
  - [ ] Timestamp of each event
  - [ ] Log level (INFO, DEBUG, ERROR, SUCCESS)
  - [ ] Detailed message for each action
- [ ] Recent logs appear at bottom
- [ ] Logs clear when switching tools

### 11. Error Handling
- [ ] If service is offline, tool shows red indicator
- [ ] Error message: "Tool service proxy failed"
- [ ] Page doesn't crash on error
- [ ] Can retry the request

### 12. Skip Login & Dashboard
- [ ] Can click "Skip Login" on first load
- [ ] Dashboard displays with limited tool access
- [ ] "Sign in later" message appears
- [ ] Can login anytime by clicking Login button
- [ ] Auto-refresh shows dashboard after login

### 13. Responsive Design
- [ ] **Desktop**: All elements visible and properly spaced
- [ ] **Tablet**: Layout adjusts, buttons readable
- [ ] **Mobile**: Single column, hamburger menu (if available)

---

## 🗄️ Database Verification

### View User Logins
```bash
mongosh mongodb://localhost:27017/microservice_tools
use microservice_tools
db.login_sessions.find().sort({timestamp: -1}).limit(5)
```

**Expected fields:**
- email (your login email)
- timestamp (login time)
- success: true
- userGroups: ['qipl.tda.developers', ...] (based on email)

### View Tool Usage
```javascript
use microservice_tools
db.tool_usage.find({userEmail: "your-email@example.com"}).limit(10)
```

**Expected fields:**
- toolId (nova, indus-report, etc.)
- userEmail
- timestamp
- executionTime (milliseconds)
- status: 'success' or 'error'
- result (first 1000 chars of output)

### Check Analytics
```bash
# Via API
curl http://localhost:5000/api/analytics

# Expected response:
{
  "totalUsers": 5,
  "totalLogins": 12,
  "totalToolUsage": 34,
  "successRate": [{"success": 30, "total": 34}],
  "toolBreakdown": [
    {"_id": "nova", "count": 15},
    {"_id": "indus-report", "count": 8}
  ],
  "topUsers": [...]
}
```

### View User Statistics
```javascript
db.user_statistics.findOne({email: "your-email@example.com"})
```

**Expected fields:**
- email
- totalLogins: number
- totalToolExecutions: number
- successfulExecutions: number
- toolBreakdown: {nova: X, indus-report: Y, ...}

---

## 🔍 API Endpoints Testing

### Test with cURL or Postman

1. **Get Tools List**
```bash
curl http://localhost:5000/api/tools
```

2. **Get Filtered Tools (by user groups)**
```bash
curl -X POST http://localhost:5000/api/tools/filtered \
  -H "Content-Type: application/json" \
  -d '{"userGroups": ["qipl.tda.developers"]}'
```

3. **Check Tool Status**
```bash
curl http://localhost:5000/api/tools/nova/status
# Expected: {"active": true}
```

4. **Execute Tool (Nova)**
```bash
curl -X POST http://localhost:5000/api/tools/nova/process \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "hello world",
    "type": "text",
    "userEmail": "admin@tda.com",
    "userGroups": ["qipl.tda.developers"]
  }'
# Expected: {"result": "ellohay orldway"}
```

5. **Get Analytics**
```bash
curl http://localhost:5000/api/analytics
```

---

## 📊 Example Complete User Journey

### Step 1: Load Website
```
1. Open http://localhost:3001
2. Wait for initialization (shows ⏳ Initializing message)
3. See login modal appears
```

### Step 2: Login
```
1. Email: admin@tda.com
2. Password: anything
3. API Key: anything
4. Click "Login"
5. Wait ~1 second for authentication
```

### Step 3: View Dashboard
```
1. See 5 tool cards (all available for admin)
2. Each tool shows:
   - Icon emoji (🔤, 📊, ✨, 🔄, 🎨)
   - Tool name
   - Description
   - Green/red status indicator
   - ✓ Service Running or ✗ Service Offline
```

### Step 4: Test Nova Tool
```
1. Click on "Nova" card
2. Tool interface opens
3. Input field shows "Enter prompt here"
4. Type: "hello world"
5. Select type: "text"
6. Click submit button
7. Wait for response
8. See output: "ellohay orldway"
9. Check log panel (if dev mode ON):
   - [SUCCESS] Request completed successfully
   - Execution time shows
```

### Step 5: Check Database
```
1. Open terminal: mongosh
2. use microservice_tools
3. db.login_sessions.findOne({email: "admin@tda.com"})
4. db.tool_usage.findOne({toolId: "nova", userEmail: "admin@tda.com"})
5. Verify data was saved with:
   - Email and groups
   - Tool ID
   - Execution time
   - Input/output length
   - Status: success
```

### Step 6: Check About Us
```
1. Click "About Us" button in header
2. Scroll through sections:
   - Mission (Innovation, Accessibility, Reliability, Security)
   - Team (4 team members with details)
   - Available Tools (all 5 tools listed)
   - Platform Features (6 features)
   - Your Status (login, tools, tips)
   - Support (contact email)
```

### Step 7: Toggle Theme
```
1. Click moon icon (🌙) in header
2. UI switches to dark mode
3. Refresh page
4. Dark mode persists
5. Click sun icon (☀️) to switch back
6. Confirm persistence after refresh
```

### Step 8: Toggle Developer Mode (Admin Only)
```
1. Look for ⚙️ icon in header
2. Click to enable developer mode
3. Orange border appears at top
4. Execute a tool
5. See execution logs on right panel
6. Logs show info/debug/error/success messages
```

---

## 🐛 Troubleshooting

### Issue: "Tool service proxy failed" Error
**Solution:**
- Check if backend service is running: `lsof -i :5000`
- Verify MongoDB connection: Check backend logs
- Restart services: See startup instructions

### Issue: Dark Mode Not Persisting
**Solution:**
- Clear browser localStorage: F12 → Application → localStorage → Clear all
- Refresh page
- Select dark mode again
- Check if localStorage is working

### Issue: Slow Page Load
**Solution:**
- Wait for initialization (first load can take 3-5 seconds)
- Check database connection status in console logs
- Ensure all services are running

### Issue: Tools Show "Service Offline"
**Solution:**
- Check if all 5 backend services are running
- Restart MongoDB: `sudo systemctl restart mongod`
- Check for port conflicts: `lsof -i :5001-5005`

### Issue: Login Doesn't Work
**Solution:**
- Check all three fields are filled (email, password, API key)
- Try different email: `test@example.com`
- Check browser console for errors (F12)
- Try logging out and logging back in

---

## ✅ Success Criteria

Website is working correctly when:
- ✅ Loads without errors
- ✅ Dark mode persists after refresh
- ✅ Tools execute successfully (see output)
- ✅ Status indicators update every 5 seconds
- ✅ User data logs to MongoDB
- ✅ Header navigation works
- ✅ About Us shows all team/mission info
- ✅ Developer mode logs appear
- ✅ No console errors
- ✅ Analytics endpoint returns data

---

## 📚 Documentation Files

- **[DATABASE.md](./DATABASE.md)**: Database schemas, queries, and setup
- **[DEPLOYMENT.md](./DEPLOYMENT.md)**: Production deployment guide
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)**: Automated testing information
- **[README.md](../README.md)**: General project information (in root)
- **[INDEX.md](./INDEX.md)**: Complete documentation index and navigation

---

**Happy Testing! 🎉**

For issues or questions, contact: support@example.com
