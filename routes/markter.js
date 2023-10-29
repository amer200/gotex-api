const express = require("express");
const routes = express.Router();
const marketerControllers = require("../controller/markter");
const adminMiddlewares = require("../middleware/admin");
const marketerMiddlewares = require("../middleware/markter");
routes.post("/signup", marketerMiddlewares.isValide, marketerControllers.MarkterSignUp);
routes.post("/login", marketerControllers.logIn);
routes.get("/get-all-markter", adminMiddlewares.isAuth, marketerControllers.getAllMarkters);
routes.get("/armex-orders", marketerMiddlewares.isAuth, marketerControllers.getAramexOrders);
module.exports = routes