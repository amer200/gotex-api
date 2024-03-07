const express = require("express");
const routes = express.Router();
const marketerControllers = require("../controller/markter");
const adminMiddlewares = require("../middleware/admin");
const marketerMiddlewares = require("../middleware/markter");
const paymentControllers = require("../controller/payment/main");

routes.post("/signup", marketerMiddlewares.isValide, marketerControllers.MarkterSignUp);
routes.post("/login", marketerControllers.logIn);

routes.get("/armex-orders", marketerMiddlewares.isAuth, marketerControllers.getAramexOrders);
routes.get("/imile-orders", marketerMiddlewares.isAuth, marketerControllers.getImileOrder);
routes.get("/jt-orders", marketerMiddlewares.isAuth, marketerControllers.getJtOrder);
routes.get("/saee-orders", marketerMiddlewares.isAuth, marketerControllers.getSaeeOrder);
routes.get("/smsa-orders", marketerMiddlewares.isAuth, marketerControllers.getSmsaOrder);

routes.get("/get-marketer-clients", marketerMiddlewares.isAuth, marketerControllers.getMarketerClients);

routes.post("/genrate-cc-link/:uId/:cId", paymentControllers.genrateCclink);
routes.get("/check-cc-payment/:ccId", paymentControllers.checkCcPayment);

// By Admin
routes.get("/get-all-markter", adminMiddlewares.isAuth, marketerControllers.getAllMarkters);

module.exports = routes