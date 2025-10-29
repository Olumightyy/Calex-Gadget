// ===================================
// CHECKOUT PAGE FUNCTIONALITY
// ===================================

// Stripe public key will be fetched from server

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

let stripe;
let elements;
let paymentElement;

async function initializeStripe() {
  const items = cart.getItems();
  
  if (items.length === 0) {
    window.location.href = 'cart.html';
    return;
  }

  // Get Stripe public key from meta tag or use environment variable
  const metaTag = document.querySelector('meta[name="stripe-public-key"]');
  let stripeKey = metaTag ? metaTag.content : null;
  
  // If no key found, try to fetch from server
  if (!stripeKey) {
    try {
      const response = await fetch('/api/get-stripe-key');
      const data = await response.json();
      stripeKey = data.publicKey;
    } catch (error) {
      console.warn('Could not fetch Stripe key from server');
    }
  }

  // Fallback: check if STRIPE_PUBLIC_KEY is available globally
  if (!stripeKey && typeof STRIPE_PUBLIC_KEY !== 'undefined' && STRIPE_PUBLIC_KEY !== 'STRIPE_PUBLIC_KEY') {
    stripeKey = STRIPE_PUBLIC_KEY;
  }

  if (!stripeKey) {
    showToast('Payment system not configured. Please contact support.', 'error');
    return;
  }

  stripe = Stripe(stripeKey);

  const items = cart.getItems();

  try {
    // Create payment intent with cart items for server-side validation
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity
        })),
        currency: 'ngn'
      }),
    });

    const { clientSecret, error } = await response.json();

    if (error) {
      showToast(error, 'error');
      return;
    }

    // Initialize Stripe Elements
    elements = stripe.elements({ clientSecret });
    paymentElement = elements.create('payment');
    paymentElement.mount('#payment-element');
  } catch (error) {
    console.error('Error initializing payment:', error);
    showToast('Error initializing payment. Please try again.', 'error');
  }
}

function renderOrderSummary() {
  const items = cart.getItems();
  const orderItemsContainer = document.getElementById('order-items');
  
  orderItemsContainer.innerHTML = items.map(item => `
    <div class="flex justify-between items-center py-2">
      <div class="flex items-center gap-3">
        <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded-lg">
        <div>
          <p class="font-medium text-sm">${item.name}</p>
          <p class="text-xs text-gray-500">Qty: ${item.quantity}</p>
        </div>
      </div>
      <span class="font-semibold">${formatPrice(item.price * item.quantity)}</span>
    </div>
  `).join('');

  const subtotal = cart.getTotal();
  const shipping = subtotal >= 10000 ? 0 : 2000;
  const total = subtotal + shipping;

  document.getElementById('subtotal').textContent = formatPrice(subtotal);
  document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : formatPrice(shipping);
  document.getElementById('total').textContent = formatPrice(total);
}

async function handleSubmit(e) {
  e.preventDefault();

  if (!stripe || !elements) {
    showToast('Payment system not ready. Please refresh the page.', 'error');
    return;
  }

  setLoading(true);

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      return_url: `${window.location.origin}/success.html`,
      receipt_email: document.getElementById('email').value,
    },
  });

  if (error) {
    if (error.type === "card_error" || error.type === "validation_error") {
      showMessage(error.message);
    } else {
      showMessage("An unexpected error occurred.");
    }
    setLoading(false);
  }
}

function setLoading(isLoading) {
  const submitButton = document.getElementById('submit-btn');
  const spinner = document.getElementById('spinner');
  const buttonText = document.getElementById('button-text');

  if (isLoading) {
    submitButton.disabled = true;
    spinner.classList.remove('hidden');
    buttonText.classList.add('hidden');
  } else {
    submitButton.disabled = false;
    spinner.classList.add('hidden');
    buttonText.classList.remove('hidden');
  }
}

function showMessage(messageText) {
  const messageContainer = document.getElementById('payment-message');
  messageContainer.classList.remove('hidden');
  messageContainer.textContent = messageText;

  setTimeout(() => {
    messageContainer.classList.add('hidden');
    messageContainer.textContent = '';
  }, 4000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
  renderOrderSummary();
  await initializeStripe();
  
  const form = document.getElementById('checkout-form');
  form.addEventListener('submit', handleSubmit);
});
