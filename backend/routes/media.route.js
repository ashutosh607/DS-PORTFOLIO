const express = require("express");
const {
  getAllMedia,
  getMediaByCategory,
  createMedia,
  updateMedia,
  updateMediaDisplay,
  deleteMedia,
} = require("../controllers/media.controller");
const { verifyAdmin } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware");

const { validateIdOrSlug } = require("../middlewares/sanitize.middleware");

const router = express.Router();

// Public read endpoints for public collections page
router.get("/", getAllMedia);
router.get("/:category", validateIdOrSlug("category"), getMediaByCategory);

// Protected admin management endpoints
router.post("/", verifyAdmin, upload.single("file"), createMedia);
router.put("/:id", verifyAdmin, validateIdOrSlug("id"), upload.single("file"), updateMedia);
router.patch("/:id/display", verifyAdmin, validateIdOrSlug("id"), updateMediaDisplay);
router.patch("/:id", verifyAdmin, validateIdOrSlug("id"), updateMediaDisplay);
router.delete("/:id", verifyAdmin, validateIdOrSlug("id"), deleteMedia);

module.exports = router;
