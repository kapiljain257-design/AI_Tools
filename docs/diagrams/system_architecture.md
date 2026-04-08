# System Architecture Diagram

```mermaid
flowchart TD
    A[React Frontend] -->|REST /api/tools| B[API Gateway (Express)]
    B -->|GET /api/tools/:id/status| C[Tool Service 1 (Express)]
    B -->|GET /api/tools/:id/status| D[Tool Service 2 (Express)]
    B -->|GET /api/tools/:id/status| E[Tool Service 3 (Express)]
    B -->|GET /api/tools/:id/status| F[Tool Service 4 (Express)]
    B -->|GET /api/tools/:id/status| G[Tool Service 5 (Express)]

    A -->|POST /api/tools/:id/process| B
    B -->|POST /process| C
    B -->|POST /process| D
    B -->|POST /process| E
    B -->|POST /process| F
    B -->|POST /process| G

    C -->|Mongoose| H[MongoDB]
    D -->|Mongoose| H
    E -->|Mongoose| H
    F -->|Mongoose| H
    G -->|Mongoose| H

    subgraph Backend
        B
        C
        D
        E
        F
        G
        H
    end

    subgraph Frontend
        A
    end
```
