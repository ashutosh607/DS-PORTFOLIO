const express = require("express");
const {
  getAllMedia,
  getMediaByCategory,
  createMedia,
  updateMedia,
  deleteMedia,
} = require("../controllers/media.controller");
const { verifyAdmin } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware");

const router = express.Router();

// Public read endpoints for public collections page
router.get("/", getAllMedia);
router.get("/:category", getMediaByCategory);

// Protected admin management endpoints
router.post("/", verifyAdmin, upload.single("file"), createMedia);
router.put("/:id", verifyAdmin, upload.single("file"), updateMedia);
router.delete("/:id", verifyAdmin, deleteMedia);

module.exports = router;
