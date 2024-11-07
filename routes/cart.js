const express = require("express");
const router = express.Router();
const cartController = require("../controller/cart");
const userMiddlewares = require("../middleware/user");

// Cart routes
router.post("/add", userMiddlewares.isAuth, cartController.addToCart); // Add item to cart
router.get("/", userMiddlewares.isAuth, cartController.getCart); // Get user's cart
router.put("/update", userMiddlewares.isAuth, cartController.updateCartItem); // Update item quantity in cart
router.delete("/remove", userMiddlewares.isAuth, cartController.removeFromCart); // Remove item from cart
router.delete("/clear", userMiddlewares.isAuth, cartController.clearCart); // Clear the cart

module.exports = router;
