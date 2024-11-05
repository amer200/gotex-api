const express = require("express");
const router = express.Router();
const categoryController = require("../controller/category");
const adminMiddleware = require("../middleware/admin");

// Create a new Category
router.post("/", adminMiddleware.isAuth, categoryController.createCategory);

// Get all Categories
router.get("/", categoryController.getCategories);

// Get a single Category by ID
router.get("/:id", categoryController.getCategoryById);

// Update a Category by ID
router.put("/:id", adminMiddleware.isAuth, categoryController.updateCategory);

// Delete a Category by ID
router.delete(
  "/:id",
  adminMiddleware.isAuth,
  categoryController.deleteCategory
);

module.exports = router;
