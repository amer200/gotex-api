const express = require("express");
const routes = express.Router();
const adminControllers = require("../controller/admin");
const adminMiddleware = require("../middleware/admin");
routes.post('/login', adminControllers.logIn);
routes.get('/get-all-users', adminMiddleware.isAuth, adminControllers.getAllUsers);
routes.post('/add-deposit-to-user', adminMiddleware.isAuth, adminControllers.addWalletToUser);
routes.post("/proof-user-cr", adminMiddleware.isAuth, adminControllers.proofCrForUser);
routes.post("/un-proof-user-cr", adminMiddleware.isAuth, adminControllers.unProofCrForUser);
routes.get("/test-data/:uId/:co", adminControllers.getUserOrders);
module.exports = routes;