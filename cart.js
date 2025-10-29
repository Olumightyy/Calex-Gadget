// ===================================
// SHOPPING CART SYSTEM
// ===================================

class ShoppingCart {
  constructor() {
    this.items = this.loadCart();
    this.updateCartBadge();
  }

  // Load cart from localStorage
  loadCart() {
    const savedCart = localStorage.getItem('calexCart');
    return savedCart ? JSON.parse(savedCart) : [];
  }

  // Save cart to localStorage
  saveCart() {
    localStorage.setItem('calexCart', JSON.stringify(this.items));
    this.updateCartBadge();
  }

  // Add item to cart
  addItem(product) {
    const existingItem = this.items.find(item => item.name === product.name);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({
        ...product,
        quantity: 1
      });
    }
    
    this.saveCart();
    return existingItem ? 'updated' : 'added';
  }

  // Remove item from cart
  removeItem(productName) {
    this.items = this.items.filter(item => item.name !== productName);
    this.saveCart();
  }

  // Update item quantity
  updateQuantity(productName, quantity) {
    const item = this.items.find(item => item.name === productName);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productName);
      } else {
        item.quantity = quantity;
        this.saveCart();
      }
    }
  }

  // Get cart items
  getItems() {
    return this.items;
  }

  // Get total items count
  getItemCount() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  // Get total price
  getTotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Clear cart
  clear() {
    this.items = [];
    this.saveCart();
  }

  // Update cart badge
  updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) {
      badge.textContent = this.getItemCount();
    }
  }
}

// Create global cart instance
const cart = new ShoppingCart();
