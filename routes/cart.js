const express = require('express');
const router = express.Router();
const cartController = require('../controller/cart');

// Cart routes
router.post('/add', cartController.addToCart);        // Add item to cart
router.get('/:userId', cartController.getCart);       // Get user's cart
router.put('/update', cartController.updateCartItem); // Update item quantity in cart
router.delete('/remove', cartController.removeFromCart); // Remove item from cart
router.delete('/clear', cartController.clearCart);    // Clear the cart

module.exports = router;
