const express = require("express");
const routes = express.Router();
const splControllers = require("../controller/spl");
const userMiddlewares = require('../middleware/user');
const adminMiddlewares = require("../middleware/admin");
const saeeMiddleware = require("../middleware/comapny");
routes.get("/token", splControllers.getToken);
module.exports = routes;