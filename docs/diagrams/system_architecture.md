# System Architecture - TDA AI NEXUS

## Overall System Flow

```mermaid
flowchart TD
    A["🖥️ React Frontend<br/>Port 3001"] -->|REST /api/tools| B["🌐 API Gateway<br/>Express | Port 5000"]
    
    B -->|/api/tools/filtered| C["📊 Tool Registry"]
    B -->|/api/tools/:id/status| D["⚡ Tool Services"]
    B -->|/api/tools/:id/process| D
    
    D --> E["📝 Nova<br/>Text Processing<br/>Port 5001"]
    D --> F["🖼️ Image Generator<br/>Image Generation<br/>Port 5002"]
    D --> G["📋 Indus Report<br/>Reporting<br/>Port 5003"]
    D --> H["✅ Perfectto<br/>QA/Optimization<br/>Port 5004"]
    D --> I["🔄 Repro Tool<br/>Issue Tracking<br/>Port 5005"]
    
    E --> J["🗄️ MongoDB<br/>Port 27017"]
    F --> J
    G --> J
    H --> J
    I --> J
    
    U["👤 User"] -->|Login| A
    A -->|Check Permission| B
    B -->|Filter Tools| A
    A -->|View Dashboard| U
```

## Frontend Component Architecture

```mermaid
graph TD
    App["App.js<br/>Main State Management"]
    
    App --> Pages["Page Components"]
    Pages --> Dashboard["Dashboard<br/>Tool Listing"]
    Pages --> TI["ToolInterface<br/>Routing Layer"]
    Pages --> Feedback["Feedback<br/>Contact Form"]
    Pages --> About["About<br/>Features & Info"]
    
    TI -->|Tool-Specific<br/>Routing| Tools["Tool Components"]
    Tools --> N["NovaInterface<br/>Text Processing"]
    Tools --> IG["ImageGeneratorInterface<br/>Image Generation"]
    Tools --> IR["IndustReportInterface<br/>Reporting"]
    Tools --> P["PerfectoInterface<br/>QA/Optimization"]
    Tools --> RT["ReproToolInterface<br/>Issue Tracking"]
    
    App --> Common["Common Components"]
    Common --> Header["Header<br/>Navigation & Theme"]
    Common --> LoginModal["LoginModal<br/>Authentication"]
    Common --> TeamInfo["TeamInfo<br/>Welcome Info"]
```

## Backend Authorization & Filtering

```mermaid
flowchart TD
    User["User Login<br/>Email Pattern"] -->|Extract Keywords| Keywords["Keyword Matching"]
    Keywords -->|nova| G1["NOVA_USERS"]
    Keywords -->|admin/tda| G2["TDA_DEVELOPERS"]
    Keywords -->|indus| G3["INDUS_USERS"]
    Keywords -->|perfectto| G4["PERFECTTO_USERS"]
    Keywords -->|repro| G5["REPRO_USERS"]
    Keywords -->|no match| G1
    
    G1 --> Groups["User Groups<br/>Array"]
    G2 --> Groups
    G3 --> Groups
    G4 --> Groups
    G5 --> Groups
    
    Groups -->|localStorage| Frontend["Frontend Stores<br/>User + Groups"]
    Frontend -->|POST /api/tools/filtered| Gateway["API Gateway<br/>Filters Tools"]
    
    Gateway -->|requiredGroups| Tools["Tool Definitions<br/>per Backend"]
    Tools -->|Check Intersection| Filtered["Only Matching<br/>Tools Returned"]
    Filtered -->|Display| Dashboard["Dashboard UI<br/>User Sees Only<br/>Accessible Tools"]
```

## Request/Response Cycle

```mermaid
sequenceDiagram
    participant ReactApp as React Frontend
    participant Gateway as API Gateway
    participant Tool as Tool Service
    participant DB as MongoDB
    
    React App->>Gateway: 1. POST /api/tools/filtered<br/>{userGroups: [...]}
    Gateway->>Gateway: Filter tools by<br/>requiredGroups
    Gateway-->>ReactApp: Return user's tools
    
    ReactApp->>Gateway: 2. GET /api/tools/:id/status<br/>(on tool select)
    Gateway->>Tool: Proxy to tool service
    Tool-->>Gateway: Check tool health
    Gateway-->>ReactApp: Tool status
    
    ReactApp->>Gateway: 3. POST /api/tools/:id/process<br/>{prompt, type}
    Gateway->>Tool: Proxy to tool service
    Tool->>DB: Query/Store data
    DB-->>Tool: Return data
    Tool-->>Gateway: Processing result
    Gateway-->>ReactApp: Result for display
```

## Data Model & Tool Definition

```mermaid
graph LR
    Tools["TOOL DEFINITION<br/>Constants.js"]
    
    Tools -->|Properties| Props["id<br/>name<br/>port<br/>description<br/>requiredGroups"]
    
    Tool1["nova<br/>Port 5001<br/>nova-users"]
    Tool2["image-generator<br/>Port 5002<br/>tda-developers"]
    Tool3["indus-report<br/>Port 5003<br/>indus-users"]
    Tool4["perfectto<br/>Port 5004<br/>perfectto-users"]
    Tool5["repro-tool<br/>Port 5005<br/>repro-users"]
    
    Tools --> Tool1
    Tools --> Tool2
    Tools --> Tool3
    Tools --> Tool4
    Tools --> Tool5
```

## State Management Flow

```mermaid
flowchart TD
    A["App.js State"] --> B["user<br/>email, apiKey"]
    A --> C["userGroups<br/>permissions array"]
    A --> D["selected<br/>current tool"]
    A --> E["input<br/>user prompt"]
    A --> F["type<br/>tool mode"]
    A --> G["output<br/>result"]
    A --> H["statusMessage<br/>status text"]
    A --> I["isLoading<br/>processing flag"]
    
    B --> J["localStorage"]
    C --> J
    
    J -.->|restore on reload| A
```

## Microservice Independence

```mermaid
graph TB
    Gateway["API Gateway 5000"]
    
    Gateway --> N["Nova 5001<br/>---<br/>input: text<br/>types: generate<br/>summarize<br/>translate"]
    
    Gateway --> IG["ImageGenerator 5002<br/>---<br/>input: description<br/>output: URL detection"]
    
    Gateway --> IR["IndustReport 5003<br/>---<br/>input: data<br/>types: executive<br/>detailed<br/>metrics"]
    
    Gateway --> P["Perfectto 5004<br/>---<br/>input: content<br/>function: optimize"]
    
    Gateway --> RT["ReproTool 5005<br/>---<br/>input: description<br/>types: bug<br/>feature<br/>issue"]
    
    N --> DB1["MongoDB"]
    IG --> DB1
    IR --> DB1
    P --> DB1
    RT --> DB1
    
    style N fill:#e1f5ff
    style IG fill:#f3e5f5
    style IR fill:#e8f5e9
    style P fill:#fff3e0
    style RT fill:#fce4ec
```

## Tool-Specific Interfaces

```mermaid
graph LR
    Tools["Tool Components"]
    
    Tools -->|NovaInterface| N["🎯 Nova<br/>---<br/>Mode Selector<br/>Text Input<br/>Process Button"]
    Tools -->|ImageGeneratorInterface| IG["🎨 ImageGenerator<br/>---<br/>Description Input<br/>Image Display<br/>URL Detection"]
    Tools -->|IndustReportInterface| IR["📊 IndustReport<br/>---<br/>Report Type<br/>Data Input<br/>Report Output"]
    Tools -->|PerfectoInterface| P["✅ Perfectto<br/>---<br/>Content Input<br/>Analysis Results<br/>Optimization Output"]
    Tools -->|ReproToolInterface| RT["🔄 ReproTool<br/>---<br/>Report Type<br/>Description<br/>Submit Button"]
```
