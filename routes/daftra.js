const express = require("express");
const routes = express.Router();
const staffController = require("../controller/daftra/staff");
const clintController = require("../controller/daftra/clints");
const inovicController = require("../controller/daftra/invoice");
const adminMiddleware = require("../middleware/admin");
const userMiddlewares = require('../middleware/user');

routes.get("/staff-get-all", adminMiddleware.isAuth, staffController.getAllStaff);
routes.get("/staff-by-id/:id", adminMiddleware.isAuth, staffController.getStaffById);
routes.post("/connect-markter-with-daftra", adminMiddleware.isAuth, staffController.connectMarkterWithDaftra);
routes.get("/clients-get-all", clintController.getAllClints);
routes.get("/client-by-id/:cId", clintController.getClintById);
routes.post("/markter-add-credit-for-client", userMiddlewares.isMarkter, clintController.addCreaditByMarkter);
routes.get("/get-all-client-credit-order", adminMiddleware.isAuth, clintController.getAllCreditOrder);
routes.post("/change-credit-order-status", clintController.ChangeCreditOrderStatus);
routes.get("/get-markter-clints", userMiddlewares.isAuth, clintController.getClintsByMartker);
routes.post("/add-new-client", userMiddlewares.isMarkter, clintController.addNewClient);
routes.post("/edit-client-info", userMiddlewares.isMarkter, clintController.editClientInfo);

routes.get("/inovic-get-all", adminMiddleware.isAuth, inovicController.getAll);
routes.get("/get-all-markter-invoices", userMiddlewares.isMarkter, inovicController.getMarkterInovices);
routes.get("/get-invoice/:id", userMiddlewares.isMarkter, inovicController.getInvoiceById);

module.exports = routes;