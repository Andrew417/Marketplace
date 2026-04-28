-- USERS
CREATE TABLE users (
    user_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    failed_attempts INT DEFAULT 0,
    lock_time DATETIME,
    created_at DATETIME DEFAULT GETDATE(),
    CHECK (status IN ('ACTIVE', 'LOCKED', 'DISABLED'))
);

--------------------------------------------------

-- ACCOUNTS
CREATE TABLE accounts (
    account_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER UNIQUE NOT NULL,
    balance DECIMAL(10,2) DEFAULT 0,
    updated_at DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

--------------------------------------------------

-- DEPOSITS
CREATE TABLE deposits (
    deposit_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL,
    amount DECIMAL(10,2) CHECK (amount > 0),
    created_at DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

--------------------------------------------------

-- ITEMS
CREATE TABLE items (
    item_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    seller_id UNIQUEIDENTIFIER NOT NULL,
    name VARCHAR(100),
    brand VARCHAR(100),
    description VARCHAR(255),
    price DECIMAL(10,2) CHECK (price > 0),
    status VARCHAR(20) DEFAULT 'AVAILABLE',
    quantity INT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (seller_id) REFERENCES users(user_id),
    CHECK (status IN ('AVAILABLE', 'OUT_OF_STOCK', 'DISABLED'))
);

--------------------------------------------------

-- ORDERS
CREATE TABLE orders (
    order_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    buyer_id UNIQUEIDENTIFIER NOT NULL,
    total_amount DECIMAL(10,2),

    FOREIGN KEY (buyer_id) REFERENCES users(user_id)
);

--------------------------------------------------

-- ORDER ITEMS
CREATE TABLE order_items (
    order_item_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    order_id UNIQUEIDENTIFIER NOT NULL,
    item_id UNIQUEIDENTIFIER NOT NULL,

    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (item_id) REFERENCES items(item_id)
);

--------------------------------------------------

-- TRANSACTIONS
CREATE TABLE transactions (
    transaction_id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    buyer_id UNIQUEIDENTIFIER,
    seller_id UNIQUEIDENTIFIER,
    order_id UNIQUEIDENTIFIER,
    type VARCHAR(20),
    status VARCHAR(20),
    created_at DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (buyer_id) REFERENCES users(user_id),
    FOREIGN KEY (seller_id) REFERENCES users(user_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),

    CHECK (type IN ('PAYMENT', 'REFUND')),
    CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED'))
);
