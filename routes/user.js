const express = require("express");
const routes = express.Router();
const userControllers = require("../controller/user");
const userMiddlewares = require('../middleware/user');
routes.post('/signup', userMiddlewares.isValide, userControllers.signUp);
routes.post('/login', userControllers.logIn);
module.exports = routes;