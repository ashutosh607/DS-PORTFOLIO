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
      let optimizedFilePath = null;
      try {
        const ext = path.extname(localFilePath).toLowerCase();
        const isVideo = [".mp4", ".mov", ".webm", ".avi", ".mkv"].includes(ext);
        const isImage = [".jpg", ".jpeg", ".jfif", ".png", ".webp", ".avif", ".tiff", ".bmp", ".heic", ".heif"].includes(ext);

        let fileToUpload = localFilePath;

        // Auto-optimize images with sharp if dimensions > 2560px or file size > 2.5MB
        if (isImage) {
          try {
            const sharp = require("sharp");
            const meta = await sharp(localFilePath).metadata();
            const stats = fs.existsSync(localFilePath) ? fs.statSync(localFilePath) : null;
            const size = stats ? stats.size : 0;
            const needsResize = (meta.width && meta.width > 2560) || (meta.height && meta.height > 2560);
            const needsCompression = size > 2.5 * 1024 * 1024;

            if (needsResize || needsCompression) {
              optimizedFilePath = path.join(
                path.dirname(localFilePath),
                `opt_${Date.now()}_${path.basename(localFilePath, ext)}.jpg`
              );
              await sharp(localFilePath)
                .rotate() // preserve camera EXIF orientation
                .resize({
                  width: 2560,
                  height: 2560,
                  fit: "inside",
                  withoutEnlargement: true,
                })
                .jpeg({ quality: 86, mozjpeg: true })
                .toFile(optimizedFilePath);

              fileToUpload = optimizedFilePath;
            }
          } catch (sharpErr) {
            console.warn("⚠️ Sharp image optimization skipped:", sharpErr.message);
          }
        }

        const stats = fs.existsSync(fileToUpload) ? fs.statSync(fileToUpload) : null;
        const fileSize = stats ? stats.size : 0;
        const isLarge = isVideo || fileSize > 10 * 1024 * 1024; // > 10MB or video

        const uploadOptions = {
          resource_type: isVideo ? "video" : "auto",
          folder: folder,
          timeout: 240000, // 4 minutes timeout for large 30MB-100MB files
        };

        if (isLarge) {
          uploadOptions.chunk_size = 6000000; // 6MB chunk size for upload_large
        }

        let response;
        if (isLarge) {
          response = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_large(fileToUpload, uploadOptions, (err, res) => {
              if (err) return reject(err);
              resolve(res);
            });
          });
        } else {
          response = await cloudinary.uploader.upload(fileToUpload, uploadOptions);
        }

        // Clean up temporary upload files
        if (optimizedFilePath && fs.existsSync(optimizedFilePath)) {
          fs.unlinkSync(optimizedFilePath);
        }
        if (fs.existsSync(localFilePath)) {
          fs.unlinkSync(localFilePath);
        }

        return response;
      } catch (cloudErr) {
        if (optimizedFilePath && fs.existsSync(optimizedFilePath)) {
          try { fs.unlinkSync(optimizedFilePath); } catch (e) {}
        }
        console.warn("⚠️ Cloudinary upload rejected:", cloudErr.message);
        console.warn("📁 Falling back to local static storage...");
      }
    }

    // 2. Safe Local Storage Fallback:
    // Sanitize folder to strictly alphanumeric, dashes, and single slashes without any traversal (..)
    const sanitizedFolder = folder
      .split("/")
      .map((segment) => segment.replace(/[^a-zA-Z0-9_\-]/g, ""))
      .filter(Boolean)
      .join("/");

    const uploadsBase = path.resolve(__dirname, "../public/uploads");
    const uploadsDir = path.resolve(uploadsBase, sanitizedFolder || "ds_portfolio");

    // Ensure uploadsDir stays strictly within uploadsBase (no path traversal)
    if (!uploadsDir.startsWith(uploadsBase)) {
      throw new Error("Invalid destination directory path");
    }

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filename = path.basename(localFilePath);
    const destinationPath = path.join(uploadsDir, filename);

    // Rename (move) file to public/uploads
    fs.renameSync(localFilePath, destinationPath);

    const relativeUrl = `/uploads/${sanitizedFolder || "ds_portfolio"}/${filename}`;
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
    console.error("Media upload handler error is caused:", error);
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
    if (!publicId || typeof publicId !== "string") return null;

    // Local file cleanup with path traversal prevention
    if (publicId.startsWith("local_")) {
      const publicUploads = path.resolve(__dirname, "../public/uploads");
      const rawTargetFilename = publicId.replace(/^local_\d+_/, "");
      const targetFilename = path.basename(rawTargetFilename).replace(/[^a-zA-Z0-9_.\-]/g, "");

      if (!targetFilename) return { result: "invalid_id" };

      const removeMatching = (dir) => {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir);
        for (const entry of entries) {
          const fullPath = path.resolve(dir, entry);
          // Boundary check: ensure fullPath is strictly inside publicUploads
          if (!fullPath.startsWith(publicUploads)) continue;

          if (fs.statSync(fullPath).isDirectory()) {
            removeMatching(fullPath);
          } else if (entry === targetFilename) {
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
