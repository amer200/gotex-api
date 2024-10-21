const express = require('express');
const router = express.Router();
const orderController = require('../controller/storeOrders');
const userMiddlewares = require('../middleware/user');
const adminMiddleware = require("../middleware/admin");
// CRUD operations for orders
router.post('/', orderController.createOrder);          // Create a new order
router.get('/', orderController.getOrders);             // Get all orders
router.get('/:orderId', orderController.getOrderById);  // Get a single order by ID
router.put('/:orderId', orderController.updateOrderStatus); // Update order status by ID
router.delete('/:orderId', orderController.deleteOrder); // Delete an order by ID

module.exports = router;
