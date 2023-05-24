const express = require("express");
const routes = express.Router();
const adminControllers = require("../controller/admin");
const adminMiddleware = require("../middleware/admin");
routes.post('/login', adminControllers.logIn);
routes.get('/get-all-users', adminMiddleware.isAuth, adminControllers.getAllUsers);
routes.post('/add-deposit-to-user', adminMiddleware.isAuth, adminControllers.addWalletToUser);
module.exports = routes;