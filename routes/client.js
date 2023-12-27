const express = require("express");
const routes = express.Router();
const userMiddlewares = require('../middleware/user');
const adminMiddleware = require("../middleware/admin");
const clientController = require("../controller/clients/clients");

routes.post("/add-new-client", userMiddlewares.isAuth, userMiddlewares.isMarkter, clientController.addClient);
routes.get("/get-all-clients", userMiddlewares.isAuth, clientController.getAllClients);
routes.get("/all-clients", userMiddlewares.isAuth, clientController.allClients);
routes.post("/edit-client/:id", userMiddlewares.isAuth, userMiddlewares.isMarkter, clientController.editClient);
routes.post("/add-client-code", adminMiddleware.isAuth, clientController.AddClientToMarkter);

routes.get("/clients-with-credit", adminMiddleware.isAuth, clientController.getClientsWithCredit);

module.exports = routes;