const express = require("express");
const routes = express.Router();
const userMiddlewares = require('../middleware/user');
const clientContorller = require("../controller/clients/clients");

routes.post("/add-new-client", userMiddlewares.isAuth, userMiddlewares.isMarkter, clientContorller.addClient);

module.exports = routes;