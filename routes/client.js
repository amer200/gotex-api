const express = require("express");
const routes = express.Router();
const userMiddlewares = require('../middleware/user');
const adminMiddleware = require("../middleware/admin");
const clientController = require("../controller/clients/clients");
const { isMarketerOrAdmin } = require("../middleware/marketerOrAdmin");

// User || Marketer
routes.post("/add-new-client", userMiddlewares.isAuth, clientController.addClient);

// Marketer || Admin
routes.post("/edit-client/:id", userMiddlewares.isAuth, clientController.editClient);
routes.get("/get-all-clients", userMiddlewares.isAuth, clientController.getAllClients);
routes.get("/all-clients", userMiddlewares.isAuth, clientController.allClients);

// Admin
routes.post("/add-client-code", adminMiddleware.isAuth, clientController.AddClientToMarkter);
routes.get("/clients-with-credit", adminMiddleware.isAuth, clientController.getClientsWithCredit);
// routes.get("/remove-client/:id", adminMiddleware.isAuth, clientController.removeClient);

module.exports = routes;