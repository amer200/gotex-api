const express = require("express");
const routes = express.Router();
const splControllers = require("../controller/spl");
const userMiddlewares = require('../middleware/user');
const adminMiddlewares = require("../middleware/admin");
const splMiddleware = require("../middleware/comapny");
const Spl = require("../model/spl");

routes.post("/edit", adminMiddlewares.isAuth, splControllers.edit);
routes.get("/token", splControllers.getToken);
routes.post("/crete-new-order", userMiddlewares.isAuth, splMiddleware.checkCompany(Spl), splControllers.creteNewOrder);
routes.post("/print-sticker/:id", userMiddlewares.isAuth, splControllers.getSticker);
routes.get("/get-all-orders", userMiddlewares.isAuth, splControllers.getUserOrders); // not added to doc
routes.get("/get-countries", splControllers.getCountries); // note used 
routes.post("/get-districts", splControllers.getDistrict); // note used 
routes.get("/get-cities", splControllers.getCities);
module.exports = routes;