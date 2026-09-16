const express = require("express");
const {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  reorderServices,
} = require("../controllers/service.controller");
const { verifyAdmin } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware");
const { validateIdOrSlug } = require("../middlewares/sanitize.middleware");

const router = express.Router();

// Public: Get all services (optional ?category=... filter)
router.get("/", getAllServices);

// Reorder must come before /:id route so "reorder" is not matched as an :id parameter
router.patch("/reorder", verifyAdmin, reorderServices);

// Public: Get single service by id
router.get("/:id", validateIdOrSlug("id"), getServiceById);

// Protected: Admin service operations
router.post("/", verifyAdmin, upload.single("imageFile"), createService);
router.put("/:id", verifyAdmin, validateIdOrSlug("id"), upload.single("imageFile"), updateService);
router.delete("/:id", verifyAdmin, validateIdOrSlug("id"), deleteService);

module.exports = router;
