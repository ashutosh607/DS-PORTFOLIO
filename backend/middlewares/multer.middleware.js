const multer = require("multer");
const path = require("path");
const fs = require("fs");

const tempDir = path.resolve(__dirname, "../public/temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    // Generate unique name while preserving original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const sanitizedOriginalName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${uniqueSuffix}-${sanitizedOriginalName}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for high-res photos & videos
  },
});

module.exports = upload;
