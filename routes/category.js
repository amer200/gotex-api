const express = require('express');
const router = express.Router();
const categoryController = require('../controller/category');

// Create a new Category
router.post('/', categoryController.createCategory);

// Get all Categories
router.get('/', categoryController.getCategories);

// Get a single Category by ID
router.get('/:id', categoryController.getCategoryById);

// Update a Category by ID
router.put('/:id', categoryController.updateCategory);

// Delete a Category by ID
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
