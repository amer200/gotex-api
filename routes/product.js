const express = require('express');
const router = express.Router();
const productController = require('../controller/product');
const adminMiddleware = require("../middleware/admin");
// CRUD operations for products
router.post('/', productController.createProduct);       // Create a new product
router.get('/', productController.getProducts);          // Get all products
router.get('/:productId', productController.getProductById); // Get a single product by ID
router.put('/:productId', productController.updateProduct);  // Update product by ID
router.delete('/:productId', productController.deleteProduct); // Delete product by ID

module.exports = router;
