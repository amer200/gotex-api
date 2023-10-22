const express = require("express");
const routes = express.Router();
const jtControllers = require("../controller/jt");
const userMiddlewares = require('../middleware/user');
const adminMiddlewares = require("../middleware/admin");
const jtMiddleware = require("../middleware/comapny");
const Jt = require("../model/jt");

routes.post("/edit", adminMiddlewares.isAuth, jtControllers.edit);
routes.post("/create-user-order", userMiddlewares.isAuth, userMiddlewares.isVerfied, jtMiddleware.checkCompany(Jt), jtControllers.createUserOrder);
routes.get("/print-sticker/:oId", jtControllers.getSticker);
routes.post("/cancel-order", userMiddlewares.isAuth, jtControllers.cancelOrder);
routes.get("/get-all-orders", userMiddlewares.isAuth, jtControllers.getUserOrders);
// routes.get("/cities", gltControllers.getAllCities);
// routes.post("/track-order-by-number", userMiddlewares.isAuth, gltControllers.trakingOrderByNum);

module.exports = routes;