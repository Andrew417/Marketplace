# Team Decisions — Distributed Online Marketplace
## CSE352s Spring 2026

> This file is the team's contract. Every member must follow these decisions.
> Any change must be communicated to ALL members before modifying this file.

---

## 1. Database

- **Engine:** MySQL
- **Host:** Decided by DB person
- **Port:** 3306 (default)

### Users Table
```sql
CREATE TABLE users (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    username        VARCHAR(50) UNIQUE NOT NULL,
    email           VARCHAR(100) UNIQUE NOT NULL,
    password        VARCHAR(255) NOT NULL,
    balance         DECIMAL(10,2) DEFAULT 0.00,
    status          ENUM('ACTIVE', 'LOCKED') DEFAULT 'ACTIVE',
    failed_attempts INT DEFAULT 0,
    lock_time       TIMESTAMP NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id     BIGINT NOT NULL REFERENCES users(id),
    type        ENUM('DEPOSIT', 'PURCHASE', 'SALE'),
    amount      DECIMAL(10,2) NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 2. JWT Structure

- **Header:** `Authorization: Bearer <token>`
- **Expiry:** 24 hours
- **Secret key location:** `src/main/resources/application.properties` → `jwt.secret`

### Token Payload
```json
{
  "user_id": 1,
  "email": "user@email.com",
  "iat": 1234567890,
  "exp": 1234567890
}
```

---

## 3. Response Format

### Success
```json
{
  "status": 200,
  "message": "Success",
  "data": {}
}
```

### Error
```json
{
  "status": 400,
  "message": "Describe what went wrong here"
}
```

### HTTP Status Codes to Use
| Situation           | Code |
|---------------------|------|
| Success             | 200  |
| Created             | 201  |
| Bad request         | 400  |
| Unauthorized        | 401  |
| Forbidden           | 403  |
| Not found           | 404  |
| Server error        | 500  |

---

## 4. Base URLs

| Member      | Packages                  | Base URL                              |
|-------------|---------------------------|---------------------------------------|
| Backend 1   | auth, account             | `/api/auth/` and `/api/account/`      |
| Backend 2   | items, inventory          | `/api/items/` and `/api/inventory/`   |
| Backend 3   | purchase, shared          | `/api/purchase/` and `/api/store/`    |
| Backend 4   | search, reports, webservices | `/api/search/`, `/api/reports/`, `/api/ws/` |

---

## 5. Endpoints Contract (Backend 1 — for UI)

### POST /api/auth/register
**Request:**
```json
{
  "username": "john",
  "email": "john@email.com",
  "password": "123456"
}
```
**Response:**
```json
{
  "status": 201,
  "message": "Account created successfully"
}
```

---

### POST /api/auth/login
**Request:**
```json
{
  "email": "john@email.com",
  "password": "123456"
}
```
**Response:**
```json
{
  "status": 200,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGc..."
  }
}
```

---

### POST /api/account/deposit
**Header:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "amount": 100.00
}
```
**Response:**
```json
{
  "status": 200,
  "message": "Deposit successful",
  "data": {
    "new_balance": 150.00
  }
}
```

---

### GET /api/account/info
**Header:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": 200,
  "data": {
    "balance": 150.00,
    "purchased_items": [],
    "sold_items": [],
    "items_for_sale": []
  }
}
```

---

## 6. Who Owns What

| Member      | Stories                          |
|-------------|----------------------------------|
| Backend 1   | i, ii, iv, vii + Bonus I         |
| Backend 2   | iii, viii + Bonus V              |
| Backend 3   | vi, 12 + Bonus III, IV           |
| Backend 4   | v, ix, x + Bonus II              |
| DB Person   | Story 11 (Distributed DB)        |
| UI Person   | All screens consuming the above  |
