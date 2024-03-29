const express = require("express");
const routes = express.Router();
const gltControllers = require("../controller/glt");
const userMiddlewares = require('../middleware/user');
const adminMiddlewares = require("../middleware/admin");
const gltMiddleware = require("../middleware/comapny");
const Glt = require("../model/glt");

routes.post("/edit", adminMiddlewares.isAuth, gltControllers.edit);
routes.post("/create-user-order", userMiddlewares.isAuth, userMiddlewares.isVerfied, gltMiddleware.checkCompany(Glt), gltControllers.createUserOrder);
routes.get("/cities", gltControllers.getAllCities);
routes.get("/get-all-orders", userMiddlewares.isAuth, gltControllers.getUserOrders);
routes.get("/print-sticker/:id", gltControllers.getSticker);
// routes.post("/track-order-by-number", userMiddlewares.isAuth, gltControllers.trakingOrderByNum);
module.exports = routes;