const express = require('express');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Product catalog - server-side source of truth for pricing
const PRODUCTS = {
  'Wireless Headphones': { price: 20000, name: 'Wireless Headphones' },
  'Macbook 13 Air': { price: 1370000, name: 'Macbook 13 Air' },
  'Dell Desktop Computer': { price: 400000, name: 'Dell Desktop Computer' },
  'Gaming Laptop': { price: 620000, name: 'Gaming Laptop' },
  'iPhone Pro Max': { price: 510000, name: 'iPhone Pro Max' },
  'Nikon Professional Camera': { price: 700000, name: 'Nikon Professional Camera' },
  'Power Bank': { price: 19000, name: 'Power Bank' },
  'Camera Tripod Stand': { price: 40000, name: 'Camera Tripod Stand' }
};

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('⚠️  Warning: STRIPE_SECRET_KEY not found. Payment processing will not work.');
}
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cache control headers
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Serve static files
app.use(express.static('.', {
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
}));

// API Routes

// Get Stripe publishable key
app.get('/api/config', (req, res) => {
  res.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || ''
  });
});

// Create payment intent
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    const { items, currency = 'ngn' } = req.body;

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.warn('Payment attempt with no items');
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate total from server-side prices
    let calculatedTotal = 0;
    const invalidItems = [];

    for (const item of items) {
      const product = PRODUCTS[item.name];
      
      if (!product) {
        invalidItems.push(item.name);
        continue;
      }

      if (!item.quantity || item.quantity < 1) {
        return res.status(400).json({ error: `Invalid quantity for ${item.name}` });
      }

      // Use server-side price only
      calculatedTotal += product.price * item.quantity;
    }

    if (invalidItems.length > 0) {
      console.warn('Payment attempt with invalid items:', invalidItems);
      return res.status(400).json({ error: `Invalid products: ${invalidItems.join(', ')}` });
    }

    // Add shipping cost
    const shipping = calculatedTotal >= 10000 ? 0 : 2000;
    const finalTotal = calculatedTotal + shipping;

    if (finalTotal <= 0) {
      return res.status(400).json({ error: 'Invalid total amount' });
    }

    console.log(`Creating payment intent for ₦${finalTotal} (${items.length} items)`);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(finalTotal * 100), // Convert to kobo (smallest currency unit)
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        itemCount: items.length,
        subtotal: calculatedTotal,
        shipping: shipping
      }
    });

    res.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: finalTotal
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verify payment
app.post('/api/verify-payment', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    const { paymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    res.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Calex Electronics Hub server running at http://0.0.0.0:${PORT}/`);
  if (stripe) {
    console.log('✅ Stripe payment processing enabled');
  } else {
    console.log('⚠️  Stripe payment processing disabled (missing API key)');
  }
});
