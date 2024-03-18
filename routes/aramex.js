const express = require("express");
const routes = express.Router();
const aramexControllers = require("../controller/aramex");
const userMiddlewares = require('../middleware/user');
const adminMiddlewares = require("../middleware/admin");
const aramexMiddleware = require("../middleware/comapny");
const Aramex = require("../model/aramex");
// const ordersControllers = require("../controller/orders");
const aramexOrders = require("../model/aramexorders");

routes.post("/edit", adminMiddlewares.isAuth, aramexControllers.edit);
routes.post("/create-user-order", userMiddlewares.isAuth, userMiddlewares.isVerfied, aramexMiddleware.checkCompany(Aramex), aramexControllers.createOrder);
routes.get("/get-all-orders", userMiddlewares.isAuth, aramexControllers.getUserOrders);
routes.get("/print-sticker/:id", aramexControllers.getSticker);
routes.get("/cities", userMiddlewares.isAuth, aramexControllers.getCities);

// routes.post("/cancel-order-request", userMiddlewares.isAuth, ordersControllers.cancelOrderRequest(aramexOrders));
// routes.post("/cancel-order-request-status", adminMiddlewares.isAuth, ordersControllers.cancelOrderRequestStatus(aramexOrders));


module.exports = routes;