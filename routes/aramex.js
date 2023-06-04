const express = require("express");
const routes = express.Router();
const aramexControllers = require("../controller/aramex");
const userMiddlewares = require('../middleware/user');
const adminMiddlewares = require("../middleware/admin");

routes.post("/edit", adminMiddlewares.isAuth, aramexControllers.edit);
routes.post("/create-user-order", userMiddlewares.isAuth, aramexControllers.createOrder);
routes.get("/get-all-orders", userMiddlewares.isAuth, aramexControllers.getUserOrders);
routes.get("/print-sticker/:id", aramexControllers.getSticker);
module.exports = routes;