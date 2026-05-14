export const mockItems = [
  {
    itemId: "item-001",
    name: "iPhone 13 Pro",
    brand: "Apple",
    category: "Electronics",
    condition: "Like New",
    price: 599.00,
    quantity: 1,
    description: "Excellent condition iPhone 13 Pro with 256GB storage. Unlocked. Always kept in case with screen protector. No scratches. Battery health at 89%.",
    sellerId: "uid-101",
    sellerName: "techseller",
    sellerRating: 4.9,
    status: "active",
    listedDate: "2026-03-01",
    images: [],
    specifications: {
      "Color": "Graphite",
      "Storage": "256GB",
      "Battery Health": "89%",
      "Includes": "Box, Cable, Case"
    }
  },
  {
    itemId: "item-002",
    name: "Sony WH-1000XM4",
    brand: "Sony",
    category: "Electronics",
    condition: "Like New",
    price: 199.00,
    quantity: 3,
    description: "Sony WH-1000XM4 Wireless Noise Cancelling Headphones. Used only a few times. Includes original case and charging cable.",
    sellerId: "uid-102",
    sellerName: "audiophile",
    sellerRating: 4.7,
    status: "active",
    listedDate: "2026-03-05",
    images: [],
    specifications: {
      "Color": "Black",
      "Type": "Over-Ear",
      "Connectivity": "Bluetooth 5.0",
      "Battery Life": "30 hours"
    }
  },
  {
    itemId: "item-003",
    name: "Mechanical Keyboard",
    brand: "Keychron",
    category: "Electronics",
    condition: "Good",
    price: 89.99,
    quantity: 2,
    description: "Keychron K2 Mechanical Keyboard with RGB backlight. Brown switches. Compact 75% layout.",
    sellerId: "uid-104",
    sellerName: "gadgetguy",
    sellerRating: 4.8,
    status: "active",
    listedDate: "2026-03-10",
    images: [],
    specifications: {
      "Switch Type": "Gateron Brown",
      "Layout": "75%",
      "Backlight": "RGB",
      "Connectivity": "Bluetooth + Wired"
    }
  },
  {
    itemId: "item-004",
    name: "Vintage Jacket",
    brand: "Levi's",
    category: "Fashion",
    condition: "Good",
    price: 45.00,
    quantity: 0,
    description: "Vintage Levi's denim jacket from the 90s. Classic style with some natural wear.",
    sellerId: "uid-105",
    sellerName: "fashionshop",
    sellerRating: 4.5,
    status: "out_of_stock",
    listedDate: "2026-02-28",
    images: [],
    specifications: {
      "Size": "Medium",
      "Color": "Blue",
      "Material": "Denim",
      "Era": "1990s"
    }
  },
  {
    itemId: "item-005",
    name: "Book Set - Science Fiction Collection",
    brand: "Various",
    category: "Books",
    condition: "Good",
    price: 34.50,
    quantity: 5,
    description: "Collection of 5 classic science fiction novels. Includes Dune, Foundation, and more.",
    sellerId: "uid-103",
    sellerName: "bookworm",
    sellerRating: 4.6,
    status: "active",
    listedDate: "2026-03-12",
    images: [],
    specifications: {
      "Format": "Paperback",
      "Number of Books": "5",
      "Condition": "Good",
      "Genres": "Science Fiction"
    }
  },
  {
    itemId: "item-006",
    name: "MacBook Air M1",
    brand: "Apple",
    category: "Electronics",
    condition: "Excellent",
    price: 689.00,
    quantity: 1,
    description: "MacBook Air M1 with 8GB RAM and 256GB SSD. Battery cycle count: 45. Includes original charger.",
    sellerId: "uid-101",
    sellerName: "techseller",
    sellerRating: 4.9,
    status: "active",
    listedDate: "2026-03-15",
    images: [],
    specifications: {
      "Processor": "Apple M1",
      "RAM": "8GB",
      "Storage": "256GB SSD",
      "Battery Cycles": "45"
    }
  },
  {
    itemId: "item-007",
    name: "Samsung Galaxy S23",
    brand: "Samsung",
    category: "Electronics",
    condition: "Like New",
    price: 649.00,
    quantity: 1,
    description: "Samsung Galaxy S23 128GB. Phantom Black. Includes original box and accessories.",
    sellerId: "uid-104",
    sellerName: "gadgetguy",
    sellerRating: 4.8,
    status: "active",
    listedDate: "2026-03-18",
    images: [],
    specifications: {
      "Color": "Phantom Black",
      "Storage": "128GB",
      "RAM": "8GB",
      "Includes": "Box, Charger, Cable"
    }
  },
  {
    itemId: "item-008",
    name: "Wireless Earbuds Pro",
    brand: "Apple",
    category: "Electronics",
    condition: "New",
    price: 179.00,
    quantity: 4,
    description: "Brand new AirPods Pro (2nd Generation). Sealed in box. Active noise cancellation.",
    sellerId: "uid-102",
    sellerName: "audiophile",
    sellerRating: 4.7,
    status: "active",
    listedDate: "2026-03-20",
    images: [],
    specifications: {
      "Generation": "2nd Gen",
      "Noise Cancellation": "Active",
      "Battery Life": "6 hours",
      "Includes": "Charging Case, Ear Tips"
    }
  }
];

// Helper function to get items by seller
export const getItemsBySeller = (sellerId) => {
  return mockItems.filter(item => item.sellerId === sellerId);
};

// Helper function to get active items (quantity > 0)
export const getActiveItems = () => {
  return mockItems.filter(item => item.status === "active" && item.quantity > 0);
};

// Helper function to search items
export const searchItems = (query) => {
  const lowerQuery = query.toLowerCase();
  return mockItems.filter(item => 
    item.name.toLowerCase().includes(lowerQuery) ||
    item.brand.toLowerCase().includes(lowerQuery) ||
    item.category.toLowerCase().includes(lowerQuery)
  );
};