const express = require('express');
const router = express.Router();
const productController = require('../controller/product');
const adminMiddleware = require("../middleware/admin");
// CRUD operations for products
router.post('/', adminMiddleware.isAuth, productController.createProduct);       // Create a new product
router.get('/', adminMiddleware.isAuth, productController.getProducts);          // Get all products
router.get('/:productId', adminMiddleware.isAuth, productController.getProductById); // Get a single product by ID
router.put('/:productId', adminMiddleware.isAuth, productController.updateProduct);  // Update product by ID
router.delete('/:productId', adminMiddleware.isAuth, productController.deleteProduct); // Delete product by ID

module.exports = router;
