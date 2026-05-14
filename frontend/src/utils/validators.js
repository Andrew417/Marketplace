export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  return { valid: true, message: '' };
};

export const validatePrice = (price) => {
  const numPrice = parseFloat(price);
  if (isNaN(numPrice) || numPrice <= 0) {
    return { valid: false, message: 'Price must be greater than $0' };
  }
  return { valid: true, message: '' };
};

export const validateQuantity = (quantity) => {
  const numQty = parseInt(quantity);
  if (isNaN(numQty) || numQty < 0) {
    return { valid: false, message: 'Quantity must be 0 or more' };
  }
  return { valid: true, message: '' };
};