const express = require("express");
const routes = express.Router();
const invMiddleware = require("../middleware/invatation");
const invControllers = require("../controller/invitation");
const userMiddlewares = require("../middleware/user");
routes.post("/create-invitation", userMiddlewares.isAuth, invMiddleware.check, invControllers.create);
routes.post("/invited-user-signup", invControllers.createInivtedUser);
module.exports = routes