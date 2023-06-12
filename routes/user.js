const express = require("express");
const routes = express.Router();
const userControllers = require("../controller/user");
const userMiddlewares = require('../middleware/user');
const adminMiddleware = require("../middleware/admin");
routes.post('/signup', userControllers.signUp);
routes.get("/activate-user/:code/:id", userControllers.activateUser);
routes.post('/marketer-signup', userMiddlewares.isValide, userControllers.MarkterSignUp);
routes.post('/login', userControllers.logIn);
routes.get('/get-user-balance', userMiddlewares.isAuth, userControllers.getUserBalance);
module.exports = routes;