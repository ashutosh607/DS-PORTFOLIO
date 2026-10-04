const multer = require("multer");
const path = require("path");
const fs = require("fs");

const tempDir = path.resolve(__dirname, "../public/temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/pjpeg",
  "image/jfif",
  "image/png",
  "image/x-png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/tiff",
  "image/bmp",
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/x-msvideo",
  "video/x-matroska",
  "application/octet-stream",
]);

const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".jfif",
  ".png",
  ".webp",
  ".avif",
  ".gif",
  ".tiff",
  ".bmp",
  ".heic",
  ".heif",
  ".mp4",
  ".mov",
  ".webm",
  ".avi",
  ".mkv",
]);

const DANGEROUS_EXTENSIONS = new Set([
  ".exe",
  ".bat",
  ".cmd",
  ".sh",
  ".php",
  ".pl",
  ".cgi",
  ".js",
  ".html",
  ".htm",
  ".svg",
  ".jar",
  ".vbs",
  ".scr",
  ".pif",
  ".msi",
]);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname).toLowerCase();
    const mime = (file.mimetype || "").toLowerCase();

    // If extension is missing (e.g. from compressed browser Blob), deduce from MIME type
    if (!ext || ext === "") {
      if (mime === "image/png" || mime === "image/x-png") ext = ".png";
      else if (mime === "image/webp") ext = ".webp";
      else if (mime === "image/avif") ext = ".avif";
      else if (mime === "image/gif") ext = ".gif";
      else if (mime.startsWith("video/")) ext = ".mp4";
      else ext = ".jpg";
    }

    const rawBase = path.basename(file.originalname, path.extname(file.originalname));
    const base = rawBase.replace(/[^a-zA-Z0-9_-]/g, "") || "photo";
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${base}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = (file.mimetype || "").toLowerCase();

  // 1. Immediately reject dangerous executable / script files
  if (DANGEROUS_EXTENSIONS.has(ext)) {
    const err = new Error("Unsupported file type. Executable and script files are strictly blocked.");
    err.statusCode = 400;
    return cb(err, false);
  }

  // 2. Extension check: valid if in allowed list or empty (browser Blob without explicit extension)
  const isAllowedExt =
    ALLOWED_EXTENSIONS.has(ext) ||
    ext === "" ||
    ext === ".jfif" ||
    ext === ".heic" ||
    ext === ".heif";

  // 3. MIME check: valid if in allowed list, standard image/video prefix, or generic stream with valid ext
  const isAllowedMime =
    ALLOWED_MIME_TYPES.has(mime) ||
    mime.startsWith("image/") ||
    mime.startsWith("video/") ||
    !mime ||
    mime === "application/octet-stream";

  if (!isAllowedExt || !isAllowedMime) {
    const err = new Error("Unsupported file type. Standard images (JPG, JPEG, PNG, WebP, AVIF, GIF) and videos (MP4, MOV, WebM) are permitted.");
    err.statusCode = 400;
    return cb(err, false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB maximum payload (supports large 30MB+ photography & 4K video clips)
  },
});

module.exports = upload;
