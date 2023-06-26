const express = require("express");
const routes = express.Router();
const invMiddleware = require("../middleware/invatation");
const invControllers = require("../controller/invitation");
const userMiddlewares = require("../middleware/user");
const adminMiddleware = require("../middleware/admin");
routes.post("/create-invitation", userMiddlewares.isAuth, invMiddleware.check, invControllers.create);
routes.post("/invited-user-signup", invControllers.createInivtedUser);
routes.get("/get-invitations-wait", adminMiddleware.isAuth, invControllers.getInvtationWaitingForAdmin);
routes.get("/accept-invitation/:id", invControllers.proveInv);
module.exports = routes