export const mockPurchases = [
  {
    transactionId: "txn-001",
    itemId: "item-001",
    itemName: "iPhone 13 Pro",
    sellerId: "uid-101",
    sellerName: "techseller",
    buyerId: "uid-001",
    buyerName: "john_doe",
    amount: 599.00,
    date: "2026-03-15",
    status: "delivered",
    orderNumber: "ORD-2026-03-15-001"
  },
  {
    transactionId: "txn-002",
    itemId: "item-002",
    itemName: "Sony WH-1000XM4",
    sellerId: "uid-102",
    sellerName: "audiophile",
    buyerId: "uid-001",
    buyerName: "john_doe",
    amount: 199.00,
    date: "2026-03-10",
    status: "shipped",
    orderNumber: "ORD-2026-03-10-042",
    trackingNumber: "1Z999AA10123456784"
  },
  {
    transactionId: "txn-003",
    itemId: "item-003",
    itemName: "Mechanical Keyboard",
    sellerId: "uid-104",
    sellerName: "gadgetguy",
    buyerId: "uid-001",
    buyerName: "john_doe",
    amount: 89.99,
    date: "2026-03-05",
    status: "delivered",
    orderNumber: "ORD-2026-03-05-018"
  }
];

export const mockSales = [
  {
    transactionId: "txn-004",
    itemId: "item-001",
    itemName: "iPhone 13 Pro",
    sellerId: "uid-101",
    sellerName: "techseller",
    buyerId: "uid-201",
    buyerName: "alice_w",
    amount: 599.00,
    date: "2026-03-22",
    status: "pending",
    orderNumber: "ORD-2026-03-22-042",
    shippingAddress: "456 Oak Ave, Alexandria, Egypt"
  },
  {
    transactionId: "txn-005",
    itemId: "item-002",
    itemName: "Sony WH-1000XM4",
    sellerId: "uid-101",
    sellerName: "techseller",
    buyerId: "uid-202",
    buyerName: "bob_s",
    amount: 199.00,
    date: "2026-03-20",
    status: "processing",
    orderNumber: "ORD-2026-03-20-039"
  },
  {
    transactionId: "txn-006",
    itemId: "item-003",
    itemName: "Mechanical Keyboard",
    sellerId: "uid-101",
    sellerName: "techseller",
    buyerId: "uid-203",
    buyerName: "charlie_m",
    amount: 89.99,
    date: "2026-03-18",
    status: "shipped",
    orderNumber: "ORD-2026-03-18-035",
    trackingNumber: "1Z888BB20234567890"
  }
];

export const allTransactions = [
  ...mockPurchases,
  ...mockSales,
  {
    transactionId: "txn-007",
    itemId: "item-005",
    itemName: "Book Set - Science Fiction Collection",
    sellerId: "uid-103",
    sellerName: "bookworm",
    buyerId: "uid-204",
    buyerName: "diana_p",
    amount: 34.50,
    date: "2026-04-20",
    status: "delivered",
    orderNumber: "ORD-2026-04-20-055"
  },
  {
    transactionId: "txn-008",
    itemId: "item-004",
    itemName: "Vintage Jacket",
    sellerId: "uid-105",
    sellerName: "fashionshop",
    buyerId: "uid-205",
    buyerName: "eva_m",
    amount: 45.00,
    date: "2026-04-21",
    status: "completed",
    orderNumber: "ORD-2026-04-21-061"
  }
];