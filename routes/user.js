const express = require("express");
const routes = express.Router();
const userControllers = require("../controller/user");
const clintControllers = require("../controller/clints");
const userMiddlewares = require('../middleware/user');
routes.post('/signup', userMiddlewares.isValide, userControllers.signUp);
routes.get("/activate-user/:code/:id", userControllers.activateUser);
routes.post('/marketer-signup', userMiddlewares.isValide, userControllers.MarkterSignUp);
routes.post('/login', userControllers.logIn);
routes.get('/get-user-balance', userMiddlewares.isAuth, userControllers.getUserBalance);
routes.get("/resend-activate-code", userMiddlewares.isAuth, userControllers.reSendActivateCode);
routes.post("/send-email-update-password", userControllers.createNewPassword);
routes.post("/update-password", userControllers.updatePassword);
routes.post("/add-new-clint", userMiddlewares.isAuth, userMiddlewares.isMarkter, clintControllers.addNewClint);
routes.post("/add-clint-deposit", userMiddlewares.isAuth, userMiddlewares.isMarkter, clintControllers.adddeposit);
routes.get("/all-markter-clint", userMiddlewares.isAuth, userMiddlewares.isMarkter, clintControllers.getAllMarkterClint);

routes.post("/add-user-balance", userMiddlewares.isAuth, userControllers.addBalance);
routes.get("/checkpayment/:status/:uId/:code", userControllers.checkPaymentOrder);
routes.get("/get-all-payment-orders", userMiddlewares.isAuth, userControllers.getAllPaymentOrders);

module.exports = routes;