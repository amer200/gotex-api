const express = require("express");
const routes = express.Router();
const saeeControllers = require("../controller/saee");
const userMiddlewares = require('../middleware/user');
const adminMiddlewares = require("../middleware/admin");
const saeeMiddleware = require("../middleware/comapny");
const Saee = require("../model/saee");

routes.post("/edit", adminMiddlewares.isAuth, saeeControllers.edit);
routes.post("/create-user-order", userMiddlewares.isAuth, userMiddlewares.isVerfied, saeeMiddleware.checkCompany(Saee), saeeControllers.createUserOrder);
routes.get("/get-all-orders", userMiddlewares.isAuth, saeeControllers.getUserOrders);
routes.get("/print-sticker/:id", userMiddlewares.isAuth, saeeControllers.getSticker);
routes.post("/track-order-by-number", userMiddlewares.isAuth, saeeControllers.trakingOrderByNum);
routes.get("/get-cities", saeeControllers.getCities);
routes.post("/cancel-order", userMiddlewares.isAuth, saeeControllers.cancelOrder);

module.exports = routes;