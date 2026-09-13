const Media = require("../models/media.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { uploadOnCloudinary, deleteFromCloudinary } = require("../utils/cloudinary");

/**
 * @route   GET /api/media
 * @desc    Get all media, optionally filtered by category query (?category=weddings)
 * @access  Public
 */
const getAllMedia = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const filter = {};

  if (category) {
    filter.category = category.toLowerCase().trim();
  }

  const mediaList = await Media.find(filter).sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, mediaList, "Media list retrieved successfully")
  );
});

/**
 * @route   GET /api/media/:category
 * @desc    Get media for a specific category slug
 * @access  Public
 */
const getMediaByCategory = asyncHandler(async (req, res) => {
  const category = req.params.category.toLowerCase().trim();
  const mediaList = await Media.find({ category }).sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, mediaList, `Media for ${category} retrieved successfully`)
  );
});

/**
 * @route   POST /api/media
 * @desc    Upload media (photo or video) and assign to category
 * @access  Protected (Admin)
 */
const createMedia = asyncHandler(async (req, res) => {
  const { category, title, caption, meta } = req.body;
  let type = req.body.type || "photo";

  if (!category || !category.trim()) {
    throw new ApiError(400, "Collection category is required");
  }

  const normalizedCategory = category.toLowerCase().trim();
  let mediaUrl = req.body.url ? req.body.url.trim() : null;
  let publicId = "";

  // 1. If file was uploaded through multipart/form-data
  if (req.file) {
    const isVideo = req.file.mimetype?.startsWith("video/");
    if (isVideo) {
      type = "video";
    }

    const folder = `ds_portfolio/collections/${normalizedCategory}`;
    const result = await uploadOnCloudinary(req.file.path, folder);

    if (!result || !result.secure_url) {
      throw new ApiError(500, "Failed to upload asset to Cloudinary media storage");
    }

    mediaUrl = result.secure_url;
    publicId = result.public_id;
    if (result.resource_type === "video") {
      type = "video";
    }
  }

  if (!mediaUrl) {
    throw new ApiError(400, "Please provide a media file or valid image/video URL");
  }

  // 2. Persist media metadata in MongoDB
  const newMedia = await Media.create({
    url: mediaUrl,
    publicId,
    type,
    category: normalizedCategory,
    title: title ? title.trim() : "",
    caption: caption ? caption.trim() : "",
    meta: meta ? meta.trim() : "",
  });

  return res.status(201).json(
    new ApiResponse(201, newMedia, "Media asset added to collection successfully")
  );
});

/**
 * @route   DELETE /api/media/:id
 * @desc    Delete media from database and Cloudinary storage
 * @access  Protected (Admin)
 */
const deleteMedia = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const media = await Media.findById(id);
  if (!media) {
    throw new ApiError(404, "Media item not found");
  }

  // 1. Remove from Cloudinary if stored there
  if (media.publicId) {
    try {
      const resourceType = media.type === "video" ? "video" : "image";
      await deleteFromCloudinary(media.publicId, resourceType);
    } catch (cloudErr) {
      console.error("Cloudinary delete warning:", cloudErr.message);
      // Continue deleting from DB even if Cloudinary file was already removed
    }
  }

  // 2. Remove document from database
  await Media.findByIdAndDelete(id);

  return res.status(200).json(
    new ApiResponse(200, { id, category: media.category }, "Media item deleted successfully")
  );
});

module.exports = {
  getAllMedia,
  getMediaByCategory,
  createMedia,
  deleteMedia,
};
