const { cloudinary, isCloudinaryConfigured } = require("../config/cloudinary");
const fs = require("fs");
const path = require("path");

/**
 * Upload a file to Cloudinary if configured with valid credentials;
 * otherwise safely persist to local static uploads directory.
 * @param {string} localFilePath - Path to the local file stored by multer in public/temp
 * @param {string} folder - Folder name / path
 * @returns {Promise<object|null>} Upload result with secure_url, public_id, and resource_type
 */
const uploadOnCloudinary = async (localFilePath, folder = "ds_portfolio") => {
  try {
    if (!localFilePath || !fs.existsSync(localFilePath)) return null;

    // 1. Try Cloudinary if real credentials are provided
    if (isCloudinaryConfigured) {
      try {
        const response = await cloudinary.uploader.upload(localFilePath, {
          resource_type: "auto",
          folder: folder,
        });

        // Clean up temporary upload file
        if (fs.existsSync(localFilePath)) {
          fs.unlinkSync(localFilePath);
        }

        return response;
      } catch (cloudErr) {
        console.warn("⚠️ Cloudinary upload rejected:", cloudErr.message);
        console.warn("📁 Falling back to local static storage...");
      }
    }

    // 2. Safe Local Storage Fallback:
    // Move from public/temp to public/uploads/...
    const sanitizedFolder = folder.replace(/[^a-zA-Z0-9_\-\/]/g, "");
    const uploadsDir = path.resolve(__dirname, "../public/uploads", sanitizedFolder);
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filename = path.basename(localFilePath);
    const destinationPath = path.join(uploadsDir, filename);

    // Rename (move) file to public/uploads
    fs.renameSync(localFilePath, destinationPath);

    const relativeUrl = `/uploads/${sanitizedFolder}/${filename}`;
    const ext = path.extname(filename).toLowerCase();
    const isVideo = [".mp4", ".mov", ".webm", ".avi", ".mkv"].includes(ext);

    return {
      secure_url: relativeUrl,
      url: relativeUrl,
      public_id: `local_${Date.now()}_${filename}`,
      resource_type: isVideo ? "video" : "image",
      format: ext.replace(".", ""),
    };
  } catch (error) {
    // Clean up temporary file if still exists
    if (localFilePath && fs.existsSync(localFilePath)) {
      try {
        fs.unlinkSync(localFilePath);
      } catch (unlinkError) {
        console.error("Error removing local file after upload failure:", unlinkError);
      }
    }
    console.error("Media upload handler error:", error);
    throw error;
  }
};

/**
 * Delete an asset by public ID (Cloudinary or local static file).
 * @param {string} publicId - Cloudinary public_id or local public_id
 * @param {string} resourceType - "image", "video", or "raw"
 * @returns {Promise<object|null>}
 */
const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  try {
    if (!publicId) return null;

    // Local file cleanup
    if (publicId.startsWith("local_")) {
      const publicUploads = path.resolve(__dirname, "../public/uploads");
      const targetFilename = publicId.replace(/^local_\d+_/, "");

      const removeMatching = (dir) => {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir);
        for (const entry of entries) {
          const fullPath = path.join(dir, entry);
          if (fs.statSync(fullPath).isDirectory()) {
            removeMatching(fullPath);
          } else if (entry === targetFilename || entry.endsWith(targetFilename)) {
            try {
              fs.unlinkSync(fullPath);
            } catch (e) {
              console.error("Failed to delete local file:", e.message);
            }
          }
        }
      };

      removeMatching(publicUploads);
      return { result: "ok" };
    }

    // Cloudinary file cleanup
    if (isCloudinaryConfigured) {
      const response = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
      return response;
    }

    return { result: "ok" };
  } catch (error) {
    console.error("Asset deletion error:", error);
    throw error;
  }
};

module.exports = {
  uploadOnCloudinary,
  deleteFromCloudinary,
};
