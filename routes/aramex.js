const express = require("express");
const routes = express.Router();
const aramexControllers = require("../controller/aramex");
const userMiddlewares = require('../middleware/user');
const adminMiddlewares = require("../middleware/admin");
routes.post("/create-user-order", aramexControllers.createOrder);
module.exports = routes;