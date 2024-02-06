const express = require("express");
const routes = express.Router();
const dhlControllers = require("../controller/dhl");
const userMiddlewares = require('../middleware/user');
const adminMiddlewares = require("../middleware/admin");
const dhlMiddleware = require("../middleware/comapny");
const Dhl = require("../model/dhl");

routes.post("/edit", adminMiddlewares.isAuth, dhlControllers.edit);
routes.post("/create-user-order", userMiddlewares.isAuth, userMiddlewares.isVerfied, dhlMiddleware.checkCompany(Dhl), dhlControllers.createUserOrder);
routes.get("/get-all-orders", userMiddlewares.isAuth, dhlControllers.getUserOrders);
routes.get("/print-sticker/:id", userMiddlewares.isAuth, dhlControllers.getSticker);
routes.get("/get-addresses", dhlControllers.getAddresses);
routes.post("/cancel-order", userMiddlewares.isAuth, dhlControllers.cancelOrder);

module.exports = routes;