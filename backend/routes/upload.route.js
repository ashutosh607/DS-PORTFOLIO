const express = require("express");
const upload = require("../middlewares/multer.middleware");
const { verifyAdmin } = require("../middlewares/auth.middleware");
const {
  uploadSingleFile,
  uploadMultipleFiles,
  deleteFile,
} = require("../controllers/upload.controller");

const router = express.Router();

// Upload single file (field name: "file")
router.post("/single", verifyAdmin, upload.single("file"), uploadSingleFile);

// Upload multiple files (field name: "files", up to 10 files)
router.post("/multiple", verifyAdmin, upload.array("files", 10), uploadMultipleFiles);

// Delete file by public_id (passed as query param, body, or route param)
router.delete("/file/:publicId", verifyAdmin, deleteFile);
router.delete("/:publicId", verifyAdmin, deleteFile);
router.delete("/", verifyAdmin, deleteFile);

module.exports = router;

