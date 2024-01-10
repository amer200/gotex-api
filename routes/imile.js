const express = require("express");
const routes = express.Router();
const adminMiddleware = require("../middleware/admin");
const userMiddlewares = require("../middleware/user");
const imileMiddlewares = require("../middleware/comapny");
const imileController = require("../controller/imile");
const Imile = require("../model/imile");
const { beforeCreateOrder, afterCreateOrder } = require("../middleware/imileClient");

routes.post("/edit", adminMiddleware.isAuth, imileController.edit);
routes.post("/add-client", userMiddlewares.isAuth, userMiddlewares.isVerfied, imileController.addClient);
routes.post("/create-user-order", userMiddlewares.isAuth, userMiddlewares.isVerfied, imileMiddlewares.checkCompany(Imile), beforeCreateOrder, imileController.createOrder, afterCreateOrder);
routes.get("/print-sticker/:id", userMiddlewares.isAuth, imileController.getSticker);
routes.get("/get-all-orders", userMiddlewares.isAuth, imileController.getUserOrders);
routes.post("/cancel-order", userMiddlewares.isAuth, imileController.cancelOrder);

routes.get("/get-all-clients", userMiddlewares.isAuth, userMiddlewares.isVerfied, imileController.getAllClients);
routes.post("/edit-client/:id", userMiddlewares.isAuth, userMiddlewares.isVerfied, imileController.editClient);

module.exports = routes;