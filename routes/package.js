const express = require("express");
const routes = express.Router();
const { addPackage, editPackage, getPackages, userBuyPackage, deletePackage, userCancelPackage, userGetPackage } = require("../controller/package");
const adminMiddlewares = require("../middleware/admin");
const userMiddlewares = require("../middleware/user");

routes.post('/', adminMiddlewares.isAuth, addPackage);
routes.post('/:id', adminMiddlewares.isAuth, editPackage);
routes.delete('/:id', adminMiddlewares.isAuth, deletePackage);
routes.get('/', getPackages);

routes.get('/user-buy-package/:id', userMiddlewares.isAuth, userBuyPackage);
routes.get('/user-cancel-package', userMiddlewares.isAuth, userCancelPackage);
routes.get('/user-get-package', userMiddlewares.isAuth, userGetPackage);

module.exports = routes;