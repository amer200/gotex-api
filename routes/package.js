const express = require("express");
const routes = express.Router();
const { addPackage, editPackage, getPackages, userBuyPackage, deletePackage, userCancelPackage, userGetPackage, marketerBuyClientPackage, marketerCancelClientPackage, marketerGetClientPackage } = require("../controller/package");
const adminMiddlewares = require("../middleware/admin");
const userMiddlewares = require("../middleware/user");

routes.post('/', adminMiddlewares.isAuth, addPackage);
routes.post('/:id', adminMiddlewares.isAuth, editPackage);
routes.delete('/:id', adminMiddlewares.isAuth, deletePackage);
routes.get('/', getPackages);

routes.get('/user-buy-package/:id', userMiddlewares.isAuth, userBuyPackage);
routes.get('/user-cancel-package', userMiddlewares.isAuth, userCancelPackage);
routes.get('/user-get-package', userMiddlewares.isAuth, userGetPackage);

routes.post('/buy-client-package/:packageId', userMiddlewares.isAuth, userMiddlewares.isMarkter, marketerBuyClientPackage);
routes.get('/cancel-client-package/:clientId', userMiddlewares.isAuth, userMiddlewares.isMarkter, marketerCancelClientPackage);
routes.get('/get-client-package/:clientId', userMiddlewares.isAuth, userMiddlewares.isMarkter, marketerGetClientPackage);

module.exports = routes;