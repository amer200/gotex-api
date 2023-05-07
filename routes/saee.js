const express = require("express");
const routes = express.Router();
const saeeControllers = require("../controller/saee");
const userMiddlewares = require('../middleware/user');
const adminMiddlewares = require("../middleware/admin");
routes.post("/edit", adminMiddlewares.isAuth, saeeControllers.edit);
routes.post("/create-user-order", userMiddlewares.isAuth, saeeControllers.createUserOrder);
module.exports = routes;