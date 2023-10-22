const express = require("express");
const routes = express.Router();
const smsaControllers = require("../controller/smsa");
const userMiddlewares = require('../middleware/user');
const adminMiddlewares = require("../middleware/admin");
const smsaMiddleware = require("../middleware/comapny");
const Smsa = require("../model/smsa");

routes.post("/edit", adminMiddlewares.isAuth, smsaControllers.edit);
routes.post("/create-user-order", userMiddlewares.isAuth, userMiddlewares.isVerfied, smsaMiddleware.isCrProofed, smsaMiddleware.checkCompany(Smsa), smsaControllers.createUserOrder);
routes.get("/get-all-orders", userMiddlewares.isAuth, smsaControllers.getUserOrders);
routes.get("/print-sticker/:id", userMiddlewares.isAuth, smsaControllers.getSticker);
// routes.post("/track-order-by-number", userMiddlewares.isAuth, smsaControllers.trakingOrderByNum);
module.exports = routes;