// src/utils/constants.js

export const USER_MODES = {
  BUYER: 'buyer',
  SELLER: 'seller',
  ADMIN: 'admin'
};

export const API_BASE_URL = 'http://localhost:8080/api';
export const SOCKET_URL = 'ws://localhost:8080';
export const BRIDGE_URL = 'ws://localhost:8085';

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const ITEM_CONDITIONS = ['New', 'Like New', 'Good', 'Fair'];

export const CATEGORIES = [
  'All',
  'Electronics',
  'Fashion',
  'Home',
  'Books',
  'Sports',
  'Toys'
];

export const QUICK_DEPOSIT_AMOUNTS = [25, 50, 100, 500];