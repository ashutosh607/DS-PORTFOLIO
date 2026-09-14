const express = require("express");
const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");
const { verifyAdmin } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware");

const router = express.Router();

// Public: Get all categories
router.get("/", getAllCategories);

// Protected: Admin category operations
router.post("/", verifyAdmin, upload.single("coverFile"), createCategory);
router.put("/:id", verifyAdmin, upload.single("coverFile"), updateCategory);
router.delete("/:id", verifyAdmin, deleteCategory);

module.exports = router;
