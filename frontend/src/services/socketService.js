// Mock socket service - Replace with real WebSocket connection in Phase 3

import { mockItems, searchItems } from '../data/mockItems';
import { currentUser, mockSellers } from '../data/mockUsers';
import { mockPurchases, mockSales, allTransactions } from '../data/mockTransactions';

// Simulate network delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Generate unique IDs
const generateId = (prefix = 'uid') => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Store registered users (in memory)
let users = [currentUser, ...mockSellers];
let items = [...mockItems];
let transactions = [...allTransactions];
let currentToken = null;

class MockSocketService {
  constructor() {
    this.listeners = {};
    this.isConnected = false;
    this.userBalance = 1243.50;
  }

  // Connect to socket (mock)
  connect() {
    console.log('[SocketService] Connecting to socket server...');
    setTimeout(() => {
      this.isConnected = true;
      console.log('[SocketService] Connected successfully');
      this.emit('connected');
    }, 500);
  }

  // Disconnect (mock)
  disconnect() {
    this.isConnected = false;
    console.log('[SocketService] Disconnected');
  }

  // Event listener system
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  // Send command and get response
  async send(command, payload = {}) {
    console.log(`[SocketService] Sending: ${command}`, payload);
    await delay();

    try {
      const response = await this.handleCommand(command, payload);
      console.log(`[SocketService] Response:`, response);
      return response;
    } catch (error) {
      console.error(`[SocketService] Error:`, error);
      return { status: 'ERROR', code: 500, message: error.message };
    }
  }

  // Handle different commands
  async handleCommand(command, payload) {
    switch (command) {
      case 'REGISTER':
        return this.handleRegister(payload);
      
      case 'LOGIN':
        return this.handleLogin(payload);
      
      case 'LOGOUT':
        currentToken = null;
        return { status: 'OK', message: 'Logged out successfully' };
      
      case 'GET_ACCOUNT':
        return this.handleGetAccount(payload);
      
      case 'SEARCH':
        return this.handleSearch(payload);
      
      case 'ADD_ITEM':
        return this.handleAddItem(payload);
      
      case 'EDIT_ITEM':
        return this.handleEditItem(payload);
      
      case 'REMOVE_ITEM':
        return this.handleRemoveItem(payload);
      
      case 'GET_INVENTORY':
        return this.handleGetInventory(payload);
      
      case 'DEPOSIT':
        return this.handleDeposit(payload);
      
      case 'PURCHASE':
        return this.handlePurchase(payload);
      
      case 'GET_REPORT':
        return this.handleGetReport(payload);
      
      default:
        return { status: 'ERROR', code: 400, message: `Unknown command: ${command}` };
    }
  }

  // REGISTER handler
  async handleRegister(payload) {
    const { username, email, password } = payload;
    
    // Validate
    if (!username || !email || !password) {
      return { status: 'ERROR', code: 400, message: 'All fields are required' };
    }
    
    if (password.length < 6) {
      return { status: 'ERROR', code: 400, message: 'Password must be at least 6 characters' };
    }
    
    // Check if email exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return { status: 'ERROR', code: 409, message: 'Email already exists' };
    }
    
    // Check if username exists
    const existingUsername = users.find(u => u.username === username);
    if (existingUsername) {
      return { status: 'ERROR', code: 409, message: 'Username already taken' };
    }
    
    // Create user
    const newUser = {
      userId: generateId('uid'),
      username,
      email,
      balance: 0,
      rating: 0,
      totalSales: 0,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    
    users.push(newUser);
    
    return {
      status: 'OK',
      userId: newUser.userId,
      message: 'Account created successfully'
    };
  }

  // LOGIN handler
  async handleLogin(payload) {
    const { username, password } = payload;
    
    if (!username || !password) {
      return { status: 'ERROR', code: 400, message: 'Username/email and password required' };
    }
    
    const user = users.find(u => 
      u.username === username || u.email === username
    );
    
    if (!user) {
      return { status: 'ERROR', code: 401, message: 'Invalid credentials' };
    }
    
    // In mock, accept any password with 6+ chars
    if (password.length < 6) {
      return { status: 'ERROR', code: 401, message: 'Invalid credentials' };
    }
    
    currentToken = `jwt-mock-${user.userId}-${Date.now()}`;
    this.userBalance = user.balance;
    
    return {
      status: 'OK',
      token: currentToken,
      userId: user.userId,
      username: user.username,
      balance: user.balance,
      message: 'Login successful'
    };
  }

  // GET_ACCOUNT handler
async handleGetAccount() {
    const user = users.find(u => u.userId === currentUser.userId);
    if (!user) {
      return { status: 'ERROR', code: 404, message: 'User not found' };
    }
    
    return {
      status: 'OK',
      userId: user.userId,
      username: user.username,
      email: user.email,
      balance: this.userBalance,
      purchases: mockPurchases,
      sales: mockSales,
      rating: user.rating,
      totalSales: user.totalSales
    };
  }

  // SEARCH handler
  async handleSearch(payload) {
    const { query, brand, minPrice, maxPrice, condition, category } = payload;
    
    let results = [...items];
    
    if (query) {
      results = searchItems(query);
    }
    
    if (brand) {
      results = results.filter(item => 
        item.brand.toLowerCase().includes(brand.toLowerCase())
      );
    }
    
    if (minPrice) {
      results = results.filter(item => item.price >= parseFloat(minPrice));
    }
    
    if (maxPrice) {
      results = results.filter(item => item.price <= parseFloat(maxPrice));
    }
    
    if (condition && condition !== 'Any') {
      results = results.filter(item => item.condition === condition);
    }
    
    if (category && category !== 'All') {
      results = results.filter(item => item.category === category);
    }
    
    // Only return active items with quantity > 0
    results = results.filter(item => item.status === 'active' && item.quantity > 0);
    
    return {
      status: 'OK',
      items: results,
      total: results.length,
      query: query || ''
    };
  }

  // ADD_ITEM handler
  async handleAddItem(payload) {
    const { name, brand, price, quantity, description, category, condition } = payload;
    
    if (!name || !brand || !price || !quantity) {
      return { status: 'ERROR', code: 400, message: 'Name, brand, price, and quantity are required' };
    }
    
    if (parseFloat(price) <= 0) {
      return { status: 'ERROR', code: 400, message: 'Price must be greater than 0' };
    }
    
    const newItem = {
      itemId: generateId('item'),
      name,
      brand,
      category: category || 'Other',
      condition: condition || 'Good',
      price: parseFloat(price),
      quantity: parseInt(quantity),
      description: description || '',
      sellerId: currentUser.userId,
      sellerName: currentUser.username,
      sellerRating: currentUser.rating,
      status: parseInt(quantity) > 0 ? 'active' : 'out_of_stock',
      listedDate: new Date().toISOString().split('T')[0],
      images: [],
      specifications: {}
    };
    
    items.push(newItem);
    
    return {
      status: 'OK',
      itemId: newItem.itemId,
      message: 'Item added successfully'
    };
  }

  // EDIT_ITEM handler
  async handleEditItem(payload) {
    const { itemId, name, brand, price, quantity, description } = payload;
    
    const itemIndex = items.findIndex(i => i.itemId === itemId);
    if (itemIndex === -1) {
      return { status: 'ERROR', code: 404, message: 'Item not found' };
    }
    
    const item = items[itemIndex];
    if (item.sellerId !== currentUser.userId) {
      return { status: 'ERROR', code: 403, message: 'Unauthorized' };
    }
    
    if (name) item.name = name;
    if (brand) item.brand = brand;
    if (price) item.price = parseFloat(price);
    if (quantity !== undefined) {
      item.quantity = parseInt(quantity);
      item.status = item.quantity > 0 ? 'active' : 'out_of_stock';
    }
    if (description) item.description = description;
    
    return {
      status: 'OK',
      message: 'Item updated successfully'
    };
  }

  // REMOVE_ITEM handler
  async handleRemoveItem(payload) {
    const { itemId } = payload;
    
    const itemIndex = items.findIndex(i => i.itemId === itemId);
    if (itemIndex === -1) {
      return { status: 'ERROR', code: 404, message: 'Item not found' };
    }
    
    const item = items[itemIndex];
    if (item.sellerId !== currentUser.userId) {
      return { status: 'ERROR', code: 403, message: 'Unauthorized' };
    }
    
    items[itemIndex].status = 'removed';
    items[itemIndex].quantity = 0;
    
    return {
      status: 'OK',
      message: 'Item removed successfully'
    };
  }

  // GET_INVENTORY handler
  async handleGetInventory() {
    const sellerItems = items.filter(i => i.sellerId === currentUser.userId && i.status !== 'removed');
    
    return {
      status: 'OK',
      items: sellerItems,
      total: sellerItems.length,
      active: sellerItems.filter(i => i.status === 'active').length,
      outOfStock: sellerItems.filter(i => i.status === 'out_of_stock').length
    };
  }

  // DEPOSIT handler
  async handleDeposit(payload) {
    const { amount } = payload;
    const depositAmount = parseFloat(amount);
    
    if (!depositAmount || depositAmount < 1.00) {
      return { status: 'ERROR', code: 400, message: 'Minimum deposit is $1.00' };
    }
    
    if (depositAmount <= 0) {
      return { status: 'ERROR', code: 400, message: 'Amount must be positive' };
    }
    
    this.userBalance += depositAmount;
    
    return {
      status: 'OK',
      newBalance: this.userBalance,
      depositedAmount: depositAmount,
      message: `Successfully deposited $${depositAmount.toFixed(2)}`
    };
  }

  // PURCHASE handler
  async handlePurchase(payload) {
    const { itemId } = payload;
    
    const item = items.find(i => i.itemId === itemId);
    if (!item) {
      return { status: 'ERROR', code: 404, message: 'Item not found' };
    }
    
    if (item.quantity <= 0) {
      return { status: 'ERROR', code: 400, message: 'Item is out of stock' };
    }
    
    if (item.sellerId === currentUser.userId) {
      return { status: 'ERROR', code: 400, message: 'Cannot purchase your own item' };
    }
    
    if (this.userBalance < item.price) {
      return { status: 'ERROR', code: 400, message: 'Insufficient funds' };
    }
    
    // Atomic transaction
    this.userBalance -= item.price;
    item.quantity -= 1;
    if (item.quantity === 0) {
      item.status = 'out_of_stock';
    }
    
    // Credit seller
    const seller = users.find(u => u.userId === item.sellerId);
    if (seller) {
      seller.balance = (seller.balance || 0) + item.price;
    }
    
    const transaction = {
      transactionId: generateId('txn'),
      itemId: item.itemId,
      itemName: item.name,
      sellerId: item.sellerId,
      sellerName: item.sellerName,
      buyerId: currentUser.userId,
      buyerName: currentUser.username,
      amount: item.price,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      orderNumber: `ORD-${new Date().toISOString().split('T')[0]}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
    };
    
    transactions.push(transaction);
    
    return {
      status: 'OK',
      transactionId: transaction.transactionId,
      orderNumber: transaction.orderNumber,
      newBalance: this.userBalance,
      message: 'Purchase complete'
    };
  }

  // GET_REPORT handler
  async handleGetReport(payload) {
    const { startDate, endDate } = payload;
    
    let reportTransactions = transactions;
    
    if (startDate) {
      reportTransactions = reportTransactions.filter(t => t.date >= startDate);
    }
    if (endDate) {
      reportTransactions = reportTransactions.filter(t => t.date <= endDate);
    }
    
    return {
      status: 'OK',
      transactions: reportTransactions,
      totalTransactions: reportTransactions.length,
      totalVolume: reportTransactions.reduce((sum, t) => sum + t.amount, 0)
    };
  }
}

// Create singleton instance
const socketService = new MockSocketService();

export default socketService;