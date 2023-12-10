const express = require("express");
const routes = express.Router();
const userControllers = require("../controller/user");
const paymentControllers = require("../controller/payment/main");
const clintControllers = require("../controller/clints");
const paymentContollers = require("../controller/payment/main")
const userMiddlewares = require('../middleware/user');
const check = require("../middleware/new-client");

routes.post('/signup', userMiddlewares.isValide, userControllers.signUp);
routes.post('/marketer-signup', userMiddlewares.isValide, userControllers.MarkterSignUp);
routes.get("/activate-user/:code/:id", userControllers.activateUser);
routes.post('/login', userControllers.logIn);
routes.get("/resend-activate-code", userMiddlewares.isAuth, userControllers.reSendActivateCode);
routes.post("/send-email-update-password", userControllers.createNewPassword);
routes.post("/update-password", userControllers.updatePassword);

routes.post("/add-user-balance", userMiddlewares.isAuth, userControllers.addBalance);
<<<<<<< HEAD
routes.get("/checkpayment/:status/:uId/:code", userControllers.checkPaymentOrder);
routes.get('/get-user-balance', userMiddlewares.isAuth, userControllers.getUserBalance);
=======
<<<<<<< HEAD
routes.get('/get-user-balance', userMiddlewares.isAuth, userControllers.getUserBalance);
routes.get("/checkpayment/:status/:uId/:code", userControllers.checkPaymentOrder);
=======
// routes.get("/checkpayment/:status/:uId/:code", userControllers.checkPaymentOrder);
>>>>>>> 3165ba8 (payment tap)
>>>>>>> f054960 (commit)
routes.get("/get-all-payment-orders", userMiddlewares.isAuth, userControllers.getAllPaymentOrders);

/** user payment [with tap gateway] */
routes.post("/user-charge", userMiddlewares.isAuth, paymentControllers.userCharge);
routes.get("/check-tap-payment/:userId/:code", paymentControllers.checkPaymentOrder);
routes.get("/get-user-payment-orders", userMiddlewares.isAuth, paymentControllers.getUserPaymentOrders);

/** By Marketer */
routes.post("/add-new-clint", userMiddlewares.isAuth, userMiddlewares.isMarkter, clintControllers.addNewClint);
routes.post("/add-clint-deposit", userMiddlewares.isAuth, userMiddlewares.isMarkter, clintControllers.adddeposit);
routes.get("/all-markter-clint", userMiddlewares.isAuth, userMiddlewares.isMarkter, clintControllers.getAllMarkterClint);
routes.post("/add-credit-to-client", userMiddlewares.isAuth, userMiddlewares.isMarkter, userControllers.addCreditsToClient);
/******tap */
routes.post("/request-payment", userMiddlewares.isAuth, paymentContollers.addDepoist);
module.exports = routes