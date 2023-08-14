const express = require("express");
const routes = express.Router();
const splControllers = require("../controller/spl");
const userMiddlewares = require('../middleware/user');
const adminMiddlewares = require("../middleware/admin");
const splMiddleware = require("../middleware/comapny");
routes.post("/edit", adminMiddlewares.isAuth, splControllers.edit);
routes.get("/token", splControllers.getToken);
routes.post("/crete-new-order", userMiddlewares.isAuth, splMiddleware.splCheck, splControllers.creteNewOrder);
routes.get("/get-all-orders", userMiddlewares.isAuth, splControllers.getUserOrders); // not added to doc
routes.get("/get-countries", splControllers.getCountries); // note used 
routes.post("/get-districts", splControllers.getDistrict); // note used 
routes.get("/get-cities", splControllers.getCities);
module.exports = routes;