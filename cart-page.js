// ===================================
// CART PAGE FUNCTIONALITY
// ===================================

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");
  
  toastMessage.textContent = message;
  toast.className = `toast-notification ${type}`;
  toast.classList.add("show");
  
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function formatPrice(price) {
  return `₦${price.toLocaleString()}`;
}

function renderCartItems() {
  const cartItemsContainer = document.getElementById('cartItems');
  const emptyCart = document.getElementById('emptyCart');
  const orderSummary = document.getElementById('orderSummary');
  const items = cart.getItems();

  if (items.length === 0) {
    cartItemsContainer.innerHTML = '';
    emptyCart.classList.remove('hidden');
    orderSummary.classList.add('hidden');
    return;
  }

  emptyCart.classList.add('hidden');
  orderSummary.classList.remove('hidden');

  cartItemsContainer.innerHTML = items.map(item => `
    <div class="bg-white rounded-xl shadow-md p-6 flex flex-col sm:flex-row gap-6 items-center" data-product="${item.name}">
      <div class="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
      </div>
      
      <div class="flex-1 text-center sm:text-left">
        <h3 class="text-lg font-bold text-gray-800 mb-1">${item.name}</h3>
        <p class="text-2xl font-bold text-blue-600">${formatPrice(item.price)}</p>
      </div>

      <div class="flex items-center gap-3">
        <button onclick="updateItemQuantity('${item.name}', ${item.quantity - 1})" class="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4"/>
          </svg>
        </button>
        
        <span class="text-lg font-semibold w-12 text-center">${item.quantity}</span>
        
        <button onclick="updateItemQuantity('${item.name}', ${item.quantity + 1})" class="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
        </button>
      </div>

      <div class="text-right">
        <p class="text-xl font-bold text-gray-900 mb-2">${formatPrice(item.price * item.quantity)}</p>
        <button onclick="removeFromCart('${item.name}')" class="text-red-500 hover:text-red-700 font-medium text-sm transition">
          Remove
        </button>
      </div>
    </div>
  `).join('');

  updateOrderSummary();
}

function updateOrderSummary() {
  const subtotal = cart.getTotal();
  const shipping = subtotal >= 10000 ? 0 : 2000;
  const total = subtotal + shipping;

  document.getElementById('subtotal').textContent = formatPrice(subtotal);
  document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : formatPrice(shipping);
  document.getElementById('total').textContent = formatPrice(total);
}

function updateItemQuantity(productName, newQuantity) {
  cart.updateQuantity(productName, newQuantity);
  renderCartItems();
  
  if (newQuantity <= 0) {
    showToast('Item removed from cart', 'success');
  }
}

function removeFromCart(productName) {
  cart.removeItem(productName);
  renderCartItems();
  showToast('Item removed from cart', 'success');
}

// Initialize cart page
document.addEventListener('DOMContentLoaded', () => {
  renderCartItems();
});
