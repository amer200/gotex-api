const express = require("express");
const routes = express.Router();
const adminMiddleware = require("../middleware/admin");
const userMiddlewares = require("../middleware/user");
const imileMiddlewares = require("../middleware/comapny");
const imileController = require("../controller/imile");

routes.post("/edit", adminMiddleware.isAuth, imileController.edit);
routes.post("/add-client", userMiddlewares.isAuth, userMiddlewares.isVerfied, imileController.addClient);
routes.post("/edit-client/:id", userMiddlewares.isAuth, userMiddlewares.isVerfied, imileController.editClient);
routes.get("/get-all-clients", userMiddlewares.isAuth, userMiddlewares.isVerfied, imileController.getAllClients);
routes.post("/create-user-order", userMiddlewares.isAuth, userMiddlewares.isVerfied, imileMiddlewares.imileCheck, imileController.createOrder);
routes.get("/get-all-orders", userMiddlewares.isAuth, imileController.getUserOrders);
routes.post("/cancel-order", userMiddlewares.isAuth, imileController.cancelOrder);

module.exports = routes;