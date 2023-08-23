const express = require("express");
const routes = express.Router();
const daftraController = require("../controller/daftra/staff");
const adminMiddleware = require("../middleware/admin");

routes.get("/staff-get-all", adminMiddleware.isAuth, daftraController.getAllStaff);
routes.get("/staff-by-id/:id", adminMiddleware.isAuth, daftraController.getStaffById);
routes.post("/connect-markter-with-daftra", adminMiddleware.isAuth, daftraController.connectMarkterWithDaftra);
module.exports = routes;