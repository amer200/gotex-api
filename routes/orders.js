const express = require("express");
const routes = express.Router();
const { isAuth } = require("../middleware/admin");
const { getAllOrders, getOrders, getOrderById } = require("../controller/orders");

// routes.get('/all', isAuth, getAllOrders);
routes.get('/', isAuth, getOrders);
routes.get('/:orderId', isAuth, getOrderById);

module.exports = routes;
