const express = require("express");
const routes = express.Router();
const userMiddlewares = require('../middleware/user');
const adminMiddlewares = require("../middleware/admin");
const companiesControllers = require("../controller/companies");

routes.get('/get-all', companiesControllers.getAllCompanies);
routes.get('/get-all-orders', companiesControllers.getAllOrders);

routes.get('/orders/all', companiesControllers.allOrders);
routes.get('/orders/filter-by-client-data', companiesControllers.filterByClientData);
routes.get('/orders/filter-by-date', companiesControllers.filterByDate);
routes.get('/orders/filter-by-price', companiesControllers.filterByPrice);
routes.get('/orders/filter-by-marketercode', companiesControllers.filterByMarketerCode);

module.exports = routes;
