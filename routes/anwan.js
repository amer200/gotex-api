const express = require("express");
const routes = express.Router();
const anwanControllers = require("../controller/anwan");
const userMiddlewares = require('../middleware/user');
const adminMiddlewares = require("../middleware/admin");
const anwanMiddleware = require("../middleware/comapny");
const Anwan = require("../model/anwan");

routes.post("/edit", adminMiddlewares.isAuth, anwanControllers.edit);
routes.post("/create-user-order", userMiddlewares.isAuth, userMiddlewares.isVerfied, anwanMiddleware.checkCompany(Anwan), anwanControllers.createUserOrder);
routes.get("/cities", userMiddlewares.isAuth, anwanControllers.getCities);
routes.get("/get-all-orders", userMiddlewares.isAuth, anwanControllers.getUserOrders);
routes.get("/print-sticker/:id", anwanControllers.getSticker);
module.exports = routes;