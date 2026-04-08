# Sequence Diagrams - TDA AI NEXUS

## 1. User Login & Tool Discovery Flow

```mermaid
sequenceDiagram
    participant User as 👤 User
    participant Frontend as 🖥️ React<br/>Frontend
    participant Storage as 💾 localStorage
    participant Gateway as 🌐 API<br/>Gateway
    
    User->>Frontend: 1. Click Login
    Frontend->>User: Show Login Modal
    User->>Frontend: 2. Enter email, password, API Key
    
    Frontend->>Frontend: 3. Parse email for keywords<br/>(nova, indus, admin, etc)
    Frontend->>Frontend: 4. Assign user groups
    
    Frontend->>Storage: 5. Save user + groups
    
    opt First time or groups changed
        Frontend->>Gateway: 6. POST /api/tools/filtered<br/>{userGroups: [...]}
        Gateway->>Gateway: 7. Filter tools by<br/>requiredGroups
        Gateway-->>Frontend: 8. Return matching tools
        Frontend->>Frontend: 9. Display in dashboard
    end
    
    Frontend-->>User: 10. Dashboard ready<br/>with accessible tools only
```

## 2. Tool Selection & Status Check

```mermaid
sequenceDiagram
    participant User as 👤 User
    participant Frontend as 🖥️ React<br/>Frontend
    participant Gateway as 🌐 API<br/>Gateway
    participant Tool as 🛠️ Tool<br/>Service
    
    User->>Frontend: 1. Click on tool<br/>in dashboard
    Frontend->>Frontend: 2. Update state<br/>selected.id = 'nova'
    
    Frontend->>Gateway: 3. GET /api/tools/nova/status
    Gateway->>Tool: 4. Forward to:<br/>http://localhost:5001/status
    
    Tool->>Tool: 5. Check health
    alt Tool Active
        Tool-->>Gateway: ✅ {active: true}
        Gateway-->>Frontend: ✅ Tool ready
        Frontend->>Frontend: 6a. Switch UI to<br/>NovaInterface
        Frontend-->>User: 7a. Display tool UI<br/>with input form
    else Tool Inactive
        Tool-->>Gateway: ❌ {active: false}
        Gateway-->>Frontend: ❌ Tool unavailable
        Frontend->>Frontend: 6b. Show message
        Frontend-->>User: 7b. Show support<br/>contact info
    end
```

## 3. Tool Processing Flow

```mermaid
sequenceDiagram
    participant User as 👤 User
    participant UI as 🎨 Tool UI<br/>Component
    participant State as 📦 App.js<br/>State
    participant Gateway as 🌐 API<br/>Gateway
    participant Tool as 🛠️ Tool<br/>Service
    participant DB as 🗄️ MongoDB
    
    User->>UI: 1. Enter input<br/>& select mode
    UI->>State: 2. Update state<br/>(input, type)
    User->>UI: 3. Click "Submit"
    
    UI->>State: 4. Call submit()
    State->>State: 5. setStatusMessage<br/>'Processing...'
    State->>State: 6. setIsLoading(true)
    
    State->>Gateway: 7. POST /api/tools/nova/process
    Note over State,Gateway: Body: {type, prompt}
    
    Gateway->>Tool: 8. Proxy to:<br/>http://localhost:5001/process

    Note over Tool: Uses shared backend config from<br/>backend/shared/toolConfig.js for `PYTHON_EXECUTABLE` and tool script paths
    Tool->>Tool: 9. Process input<br/>based on type
    opt If using MongoDB
        Tool->>DB: 10. Store result/log
        DB-->>Tool: Saved
    end
    
    Tool-->>Gateway: 11. Return result
    Gateway-->>State: 12. Result object
    
    State->>State: 13. setOutput(result)
    State->>State: 14. setStatusMessage('Done')
    State->>State: 15. setIsLoading(false)
    
    State->>UI: 16. Pass output as prop
    UI->>UI: 17. Render output
    UI-->>User: 18. Display result<br/>to user
```

## 4. Tool Component Lifecycle

```mermaid
sequenceDiagram
    participant Router as 🔄 App.js<br/>Router
    participant Generic as 📋 ToolInterface.js<br/>Generic
    participant Specific as 🎯 Specific UI<br/>Component
    participant User as 👤 User
    
    Router->>Router: 1. selected.id = 'nova'
    
    Router->>Router: 2. switch(selected.id)
    
    alt Match found
        Router->>Specific: 3. Render<br/>NovaInterface
        Specific->>User: 4. Mount component
        Specific->>Specific: 5. Display tool header<br/>with emoji & description
        Specific->>User: 6. Show tool UI
        User->>Specific: 7. Interact with<br/>tool-specific UI
    else No match
        Router->>Generic: 3. Fallback to<br/>generic interface
        Generic->>User: 4. Show generic UI
    end
```

## 5. Permission Filtering Logic

```mermaid
sequenceDiagram
    participant Frontend as 🖥️ Frontend
    participant Gateway as 🌐 API Gateway
    participant ToolConfig as 📋 Tool Definitions
    
    Frontend->>Gateway: 1. POST /api/tools/filtered
    Note over Frontend,Gateway: Body: {userGroups: ['qipl.nova.users']}
    
    Gateway->>ToolConfig: 2. Get all tools
    
    loop For each tool
        ToolConfig->>ToolConfig: 3a. Get tool.requiredGroups
        Gateway->>Gateway: 3b. Intersection check:<br/>userGroups ∩ requiredGroups
    end
    
    Gateway->>Gateway: 4. Keep only matching tools
    
    Gateway-->>Frontend: 5. Return filtered<br/>tool list
    
    Note over Gateway: Example decision logic:<br/>User: [nova-users, indus-users]<br/>Nova tool needs: [nova-users, tda-devs]<br/>✅ Include Nova<br/>IndustReport needs: [indus-users, tda-devs]<br/>✅ Include IndustReport<br/>Perfectto needs: [perfectto-users, tda-devs]<br/>❌ Exclude Perfectto
```

## 6. Error Handling Flow

```mermaid
sequenceDiagram
    participant User as 👤 User
    participant UI as 🎨 UI Component
    participant State as 📦 State
    participant Gateway as 🌐 Gateway
    participant Tool as 🛠️ Tool
    
    User->>UI: Submit process request
    UI->>State: Call submit()
    
    State->>Gateway: POST /api/tools/:id/process
    
    alt Network Error
        Gateway--xState: ❌ Connection failed
        State->>State: setStatusMessage('Error')<br/>setOutput('')
        State->>UI: Pass error status
        UI-->>User: Show error message
    else Tool Returns Error
        Gateway->>Tool: Proxy request
        Tool--xGateway: ❌ Error response
        Gateway--xState: Error object
        State->>State: Catch error
        State->>State: setStatusMessage(SUPPORT.error)
        State->>UI: Pass error
        UI-->>User: Show support contact
    else Success
        Tool-->>Gateway: 200 OK {result}
        Gateway-->>State: {result/output}
        State->>State: setOutput(result)
        State->>State: setStatusMessage('Done')
        State->>UI: Pass result
        UI-->>User: Display result
    end
```
