const express = require("express");
const routes = express.Router();
const userMiddlewares = require('../middleware/user');
const clientController = require("../controller/clients/clients");

routes.post("/add-new-client", userMiddlewares.isAuth, userMiddlewares.isMarkter, clientController.addClient);
routes.get("/get-all-clients", userMiddlewares.isAuth, clientController.getAllClients);
routes.post("/edit-client/:id", userMiddlewares.isAuth, userMiddlewares.isMarkter, clientController.editClient);

module.exports = routes;