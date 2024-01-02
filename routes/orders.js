const express = require("express");
const routes = express.Router();
const { isAuth } = require("../middleware/admin");
const { getAllOrders, getOrders } = require("../controller/orders");

// routes.get('/all', isAuth, getAllOrders);
routes.get('/', isAuth, getOrders);

module.exports = routes;
