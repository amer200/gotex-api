const express = require("express");
const routes = express.Router();
const userMiddlewares = require("../middleware/user");
const adminMiddlewares = require("../middleware/admin");
const { checkCompany } = require("../middleware/comapny");
const {
  edit,
  createUserOrder,
  getUserOrders,
  getSticker,
  cancelOrder,
} = require("../controller/gotex");
const Gotex = require("../model/gotex");

routes.post("/edit", adminMiddlewares.isAuth, edit);

routes.post(
  "/create-user-order",
  userMiddlewares.isAuth,
  userMiddlewares.isVerfied,
  checkCompany(Gotex),
  createUserOrder
);

routes.get("/get-user-orders", userMiddlewares.isAuth, getUserOrders);
routes.get("/print-sticker/:id", userMiddlewares.isAuth, getSticker);
routes.post("/cancel-order", userMiddlewares.isAuth, cancelOrder);

module.exports = routes;
