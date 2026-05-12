-- Clean up existing tables
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS deposits;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS users;

-- USERS
CREATE TABLE users (
    user_id UUID PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    failed_attempts INT DEFAULT 0,
    lock_time TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ACCOUNTS
CREATE TABLE accounts (
    account_id UUID PRIMARY KEY,
    user_id UUID UNIQUE NOT NULL,
    balance DECIMAL(10,2) DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- DEPOSITS
CREATE TABLE deposits (
    deposit_id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    amount DECIMAL(10,2) CHECK (amount > 0),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- TRANSACTIONS
CREATE TABLE transactions (
    transaction_id UUID PRIMARY KEY,
    buyer_id UUID,
    seller_id UUID,
    order_id UUID,
    type VARCHAR(20),
    status VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES users(user_id)
);
