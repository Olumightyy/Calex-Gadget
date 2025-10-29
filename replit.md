# Calex Electronics Hub

## Overview
Calex Electronics Hub is a fully functional e-commerce website for selling electronic gadgets and devices. Built with vanilla HTML, CSS (Tailwind), JavaScript, and Node.js/Express backend with Stripe payment integration.

## Project Structure
```
├── index.html              # Main homepage
├── cart.html              # Shopping cart page
├── checkout.html          # Checkout page with payment
├── success.html           # Order confirmation page
├── main.js                # Homepage functionality
├── cart.js                # Shopping cart system (localStorage)
├── cart-page.js           # Cart page functionality
├── checkout.js            # Checkout and Stripe integration
├── style.css              # Custom CSS styles
├── server.js              # Express server with Stripe API
├── images/                # Product images
└── attached_assets/       # Stock images
```

## Features

### E-commerce Functionality
- **Product Catalog**: 8 products with images, prices, and ratings
- **Shopping Cart**: 
  - Add products to cart
  - Persistent cart using localStorage
  - Update quantities
  - Remove items
  - Real-time cart badge updates
- **Checkout Process**:
  - Customer information form
  - Order summary
  - Stripe payment integration
  - Form validation
- **Payment Processing**:
  - Secure Stripe integration
  - Support for Nigerian Naira (NGN)
  - Payment confirmation
- **Order Confirmation**: 
  - Success page with order details
  - Animated checkmark
  - Cart clearance after purchase

### Website Features
- Responsive design (mobile, tablet, desktop)
- Banner slider with auto-play
- Product search and filter
- Customer reviews system
- Toast notifications
- Smooth scrolling
- Newsletter subscription form
- Free shipping on orders over ₦10,000

## Technology Stack
- **Frontend**: HTML5, CSS3 (Tailwind CSS via CDN), Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Payment**: Stripe
- **Storage**: localStorage for cart persistence
- **Server**: Express with CORS and body-parser

## API Endpoints
- `GET /api/get-stripe-key` - Retrieve Stripe public key
- `POST /api/create-payment-intent` - Create Stripe payment intent
- `POST /api/verify-payment` - Verify payment status

## Environment Variables
- `STRIPE_PUBLIC_KEY` - Stripe publishable key (pk_*)
- `STRIPE_SECRET_KEY` - Stripe secret key (sk_*)

## Recent Changes
- **Oct 29, 2025**: Full e-commerce implementation
  - Created comprehensive shopping cart system with localStorage
  - Built cart management page (add, remove, update quantities)
  - Integrated Stripe payment processing
  - Created checkout page with payment form
  - Added order confirmation page
  - Upgraded to Express server for API endpoints
  - Downloaded and added stock images for missing products
  - Implemented shipping calculation (free over ₦10,000)
  
- **Oct 29, 2025**: Initial Replit setup
  - Created Node.js HTTP server for static file serving
  - Fixed CSS reference (styles.css → style.css)
  - Configured server on port 5000 with cache control headers
  - Set up workflow for automatic deployment

## User Preferences
- Currency: Nigerian Naira (₦)
- Free shipping threshold: ₦10,000
- Default shipping cost: ₦2,000

## Running the Project
The server runs on port 5000 and includes:
1. Static file serving for all HTML/CSS/JS/images
2. API endpoints for Stripe payment processing
3. Cache control headers for proper updates
4. CORS enabled for payment integration

## Testing Stripe Integration
To test payments in development:
1. Use Stripe test mode keys (pk_test_* and sk_test_*)
2. Use Stripe test card numbers:
   - Success: 4242 4242 4242 4242
   - Requires authentication: 4000 0025 0000 3155
   - Declined: 4000 0000 0000 9995
3. Any future expiry date
4. Any 3-digit CVC

## Deployment
Configured for Replit autoscale deployment with production-ready Express server.
