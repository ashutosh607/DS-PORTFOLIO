const cloudinary = require("../config/cloudinary");
const fs = require("fs");

/**
 * Upload a local file to Cloudinary and clean up the temporary file.
 * @param {string} localFilePath - Path to the local file stored by multer
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<object|null>} Cloudinary upload result
 */
const uploadOnCloudinary = async (localFilePath, folder = "ds_portfolio") => {
  try {
    if (!localFilePath) return null;

    // Upload file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: folder,
    });

    // File uploaded successfully, remove locally saved temporary file
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return response;
  } catch (error) {
    // Remove locally saved temporary file as the upload operation failed
    if (localFilePath && fs.existsSync(localFilePath)) {
      try {
        fs.unlinkSync(localFilePath);
      } catch (unlinkError) {
        console.error("Error removing local file after upload failure:", unlinkError);
      }
    }
    console.error("Cloudinary upload failed:", error);
    throw error;
  }
};

/**
 * Delete an asset from Cloudinary by public ID.
 * @param {string} publicId - Cloudinary public_id of the asset
 * @param {string} resourceType - "image", "video", or "raw"
 * @returns {Promise<object|null>}
 */
const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  try {
    if (!publicId) return null;
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return response;
  } catch (error) {
    console.error("Cloudinary delete failed:", error);
    throw error;
  }
};

module.exports = {
  uploadOnCloudinary,
  deleteFromCloudinary,
};
