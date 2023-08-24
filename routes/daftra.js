const express = require("express");
const routes = express.Router();
const staffController = require("../controller/daftra/staff");
const clintController = require("../controller/daftra/clints");
const adminMiddleware = require("../middleware/admin");
const userMiddlewares = require('../middleware/user');

routes.get("/staff-get-all", adminMiddleware.isAuth, staffController.getAllStaff);
routes.get("/staff-by-id/:id", adminMiddleware.isAuth, staffController.getStaffById);
routes.post("/connect-markter-with-daftra", adminMiddleware.isAuth, staffController.connectMarkterWithDaftra);
routes.get("/clients-get-all", clintController.getAllClints);
routes.get("/client-by-id/:cId", clintController.getClintById);
routes.get("/get-markter-clints", userMiddlewares.isAuth, clintController.getClintsByMartker);
routes.post("/add-new-client", userMiddlewares.isMarkter, clintController.addNewClient);
routes.post("/edit-client-info", userMiddlewares.isMarkter, clintController.editClientInfo);
module.exports = routes;