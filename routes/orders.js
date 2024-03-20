const express = require("express");
const routes = express.Router();
const { isAuth } = require("../middleware/user");
const { isAuth: isAdminAuth } = require("../middleware/admin");
const { getAllOrders, getOrders, getOrderById, getCancelOrderRequests, cancelOrderRequest, cancelOrderRequestStatus, filterOrdersByDate } = require("../controller/orders");

routes.get('/get-cancel-order-requests', isAdminAuth, getCancelOrderRequests);
routes.post("/cancel-order-request", isAuth, cancelOrderRequest);
routes.post("/cancel-order-request-status", isAdminAuth, cancelOrderRequestStatus);

// routes.get('/all', isAdminAuth, getAllOrders);
routes.get('/', isAdminAuth, getOrders);
routes.get('/filter-by-date', isAdminAuth, filterOrdersByDate);
routes.get('/:orderId', isAdminAuth, getOrderById);


module.exports = routes;
