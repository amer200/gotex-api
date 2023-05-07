const express = require("express");
const routes = express.Router();
const adminControllers = require("../controller/admin");
routes.post('/login', adminControllers.logIn);
module.exports = routes;