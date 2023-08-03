const express = require("express");
const routes = express.Router();
const splControllers = require("../controller/spl");
const userMiddlewares = require('../middleware/user');
const adminMiddlewares = require("../middleware/admin");
const saeeMiddleware = require("../middleware/comapny");
routes.get("/token", splControllers.getToken);
routes.post("/crete-new-order", splControllers.creteNewOrder);
routes.get("/get-countries", splControllers.getCountries);
routes.get("/get-districts", splControllers.getDistrict);

module.exports = routes;