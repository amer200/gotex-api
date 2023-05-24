const express = require("express");
const routes = express.Router();
const userMiddlewares = require('../middleware/user');
const adminMiddlewares = require("../middleware/admin");
const companiesControllers = require("../controller/companies");

routes.get('/get-all', companiesControllers.getAllCompanies);
routes.get('/get-all-orders',  companiesControllers.getAllOrders);
module.exports = routes;
