# Parallel Market - Distributed Marketplace Platform

A distributed marketplace built with raw TCP sockets for core logic, Spring Boot REST services, and CockroachDB for distributed storage. React frontend communicates via WebSocket bridge.

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Socket Server | Java (Raw TCP, no frameworks) |
| Bridge Server | Java (Pure Java) |
| REST Server | Java + Spring Boot |
| Frontend | React |
| Database | CockroachDB |

---

## Architecture

Three-tier distributed system:

```
React Frontend ──WebSocket──► Bridge Server ──TCP──► Socket Server ──┐
       │                                                    │
       └─────────HTTP────────► Spring Boot ─────────────────┘
                                                             │
                                                        CockroachDB
```

| Component | Responsibility |
|-----------|----------------|
| **Socket Server** | Core marketplace logic (auth, items, purchase, search, reports) |
| **Bridge Server** | WebSocket-to-TCP translation (no business logic) |
| **Spring Boot** | REST endpoints (3 features) + Partner Store API |
| **React** | UI screens, connects via WebSocket + HTTP |

---

## Project Structure

```
parallel-market/
├── socket-server/           # Core TCP server
│   ├── handlers/            # Request handlers
│   ├── services/            # Business logic
│   ├── models/              # Shared entities
│   └── db/                  # JDBC
├── web-services/            # Spring Boot REST
├── bridge/                  # WebSocket-TCP bridge
├── frontend/                # React UI
│   └── src/screens/         # All UI pages
├── database/
│   ├── schema.sql
│   ├── partitioning.sql
│   └── seed.sql
└── docs/
    ├── socket-protocol.md
    └── api-contract.md
```

### Shared Models

- **Entities:** `User`, `Item`, `Transaction`, `Inventory`
- **DTOs:** `UserResponseDto`, `ItemDto`, `TransactionDto`
- **Exceptions:** `InsufficientBalanceException`, `ItemNotFoundException`, `UserNotFoundException`, `UnauthorizedActionException`

---

## Application Protocol

Raw TCP uses `COMMAND|{JSON payload}` format.

| Command | Description |
|---------|-------------|
| `REGISTER` | Create account |
| `LOGIN` | Authenticate (returns JWT) |
| `LOGOUT` | End session |
| `ADD_ITEM` | List item for sale |
| `EDIT_ITEM` | Modify listing |
| `REMOVE_ITEM` | Delete listing |
| `SEARCH` | Find by name/brand |
| `PURCHASE` | Atomic buy transaction |
| `DEPOSIT` | Add funds |
| `GET_ACCOUNT` | View balance/history |
| `GET_INVENTORY` | Manage stock |
| `GET_REPORT` | Transaction reports |

**Example:**
```
REGISTER|{"username":"ahmed","email":"a@b.com","password":"hash123"}
← OK|{"userid":"uid-123","message":"Account created"}
```

---

## Database Design (CockroachDB)

### Partitioning Strategy

| Table | Strategy | Key |
|-------|----------|-----|
| Users, Items | Horizontal | ID range |
| Transactions | Date range | timestamp |

### Key Benefits

- Horizontal scaling by adding nodes
- Automatic 3-way replication
- Self-healing & fault tolerance
- Raft consensus for transactions

---

## Partner Store API

External stores can integrate via REST.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/store/products` | GET | List available items |
| `/api/store/order` | POST | Place order (atomic) |

**Authentication:** `X-API-KEY` header

**Order flow (atomic):** Validate key → check item → update seller balance → mark sold → record transaction → return receipt

---

## Getting Started

### Prerequisites
- Java 17+, Node.js 18+, CockroachDB, Maven

### Setup
```bash
# Database
cockroach sql --insecure < database/schema.sql
cockroach sql --insecure < database/partitioning.sql
cockroach sql --insecure < database/seed.sql

# Socket server (port 5000)
cd socket-server && mvn exec:java

# Bridge (port 8081)
cd ../bridge && mvn exec:java

# REST server (port 8080)
cd ../web-services && mvn spring-boot:run

# Frontend (port 3000)
cd ../frontend && npm install && npm start
```

---

## Git Strategy

```
main ─── production only
dev ─── integration branch
feature/* ─── one branch per feature
```

- No direct pushes to `main` or `dev`
- PR to `dev` requires 1 reviewer approval

---

## Core Features (9)

| # | Feature |
|---|---------|
| i | Register |
| ii | Login/Logout (JWT) |
| iii | Add/Edit/Remove items |
| iv | Deposit cash |
| v | Search items |
| vi | Purchase (atomic) |
| vii | View account |
| viii | Manage inventory |
| ix | Reports |

### Bonus REST Features
- Register, Login, Deposit (via Spring Boot)

---

## Team

| Role | Members |
|------|---------|
| Backend - Socket | Hazem, Mathew, Marten, Ziad |
| Backend - Web Services | (2) |
| Frontend | Julia, Maria |
| Database | Kerlos |
| DevOps/Integration | Andrew, Arsany |

### Responsibilities

**Backend Socket:** Protocol design, 9 TCP features, atomic purchases, multi-threading, JDBC

**Backend Web Services:** REST endpoints (3+), Partner Store API

**Frontend:** All UI screens, WebSocket + HTTP connections, mock data

**Database:** Schema, partitioning, SQL files

**DevOps:** GitHub, bridge server, documentation, demo

---

## Testing

```bash
# Socket
nc localhost 5000
REGISTER|{"username":"test","email":"t@x.com","password":"pass"}

# REST
curl -X POST http://localhost:8080/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"t@x.com","password":"pass"}'

# Partner API
curl -X GET http://localhost:8080/api/store/products \
  -H "X-API-KEY: {key}"
```

---

## License

Academic project — CSE 352, Faculty of Engineering, Ain Shams University