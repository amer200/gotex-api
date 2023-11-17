const express = require("express");
const routes = express.Router();
const { addPackage, getPackage, userBuyPackage } = require("../controller/package");
const adminMiddleware = require("../middleware/admin");
const userMiddleware = require("../middleware/user");

routes.post('/', adminMiddleware.isAuth, addPackage);
routes.get('/', getPackage);

routes.post('/user-buy-package', userMiddleware.isAuth, userBuyPackage);

module.exports = routes;