const fs = require("fs");
const Media = require("../models/media.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { uploadOnCloudinary, deleteFromCloudinary } = require("../utils/cloudinary");

const sanitizeDisplay = (input) => {
  if (!input) return null;
  let parsed = input;
  if (typeof input === "string") {
    try {
      parsed = JSON.parse(input);
    } catch {
      return null;
    }
  }
  if (typeof parsed !== "object" || parsed === null) return null;
  const fit = parsed.fit === "contain" || parsed.fit === "fit" ? "contain" : "cover";
  const posX = typeof parsed.position?.x === "number" ? Math.max(0, Math.min(100, Math.round(parsed.position.x * 10) / 10)) : 50;
  const posY = typeof parsed.position?.y === "number" ? Math.max(0, Math.min(100, Math.round(parsed.position.y * 10) / 10)) : 50;
  const zoom = typeof parsed.zoom === "number" ? Math.max(1, Math.min(3, Math.round(parsed.zoom * 100) / 100)) : 1;
  return {
    fit,
    position: { x: posX, y: posY },
    zoom,
  };
};

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
  const normalizedType = (req.body.type || "photo").toLowerCase().trim();
  if (!["photo", "video"].includes(normalizedType)) {
    if (req.file && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    throw new ApiError(400, "Invalid media type: must be 'photo' or 'video'");
  }
  let type = normalizedType;

  if (!category || !category.trim()) {
    if (req.file && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    throw new ApiError(400, "Collection category is required");
  }

  const normalizedCategory = category.toLowerCase().trim();
  if (!/^[a-z0-9-]+$/.test(normalizedCategory)) {
    if (req.file && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    throw new ApiError(400, "Invalid category slug format");
  }

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
    ...(sanitizeDisplay(req.body.display) ? { display: sanitizeDisplay(req.body.display) } : {}),
  });

  return res.status(201).json(
    new ApiResponse(201, newMedia, "Media asset added to collection successfully")
  );
});

/**
 * @route   PUT /api/media/:id
 * @desc    Update media asset (custom or baseline)
 * @access  Protected (Admin)
 */
const updateMedia = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { category, title, caption, meta, url, type, display } = req.body;
  const mongoose = require("mongoose");

  let existingMedia = null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    existingMedia = await Media.findById(id);
  }
  if (!existingMedia) {
    existingMedia = await Media.findOne({ baselineId: id });
  }

  let mediaUrl = url ? url.trim() : (existingMedia ? existingMedia.url : "");
  let publicId = existingMedia ? existingMedia.publicId : "";
  let mediaType = type ? type.toLowerCase().trim() : (existingMedia ? existingMedia.type : "photo");
  if (type && !["photo", "video"].includes(mediaType)) {
    throw new ApiError(400, "Invalid media type: must be 'photo' or 'video'");
  }

  const targetCategory = (category || existingMedia?.category || "weddings").toLowerCase().trim();
  if (category && !/^[a-z0-9-]+$/.test(targetCategory)) {
    throw new ApiError(400, "Invalid category slug format");
  }

  // 1. Handle uploaded file if present
  if (req.file) {
    const isVideo = req.file.mimetype?.startsWith("video/");
    if (isVideo) {
      mediaType = "video";
    }

    const folder = `ds_portfolio/collections/${targetCategory}`;
    const result = await uploadOnCloudinary(req.file.path, folder);

    if (!result || !result.secure_url) {
      throw new ApiError(500, "Failed to upload asset to Cloudinary media storage");
    }

    // Delete old asset from Cloudinary if previously stored
    if (existingMedia?.publicId) {
      try {
        const oldResourceType = existingMedia.type === "video" ? "video" : "image";
        await deleteFromCloudinary(existingMedia.publicId, oldResourceType);
      } catch (cloudErr) {
        console.warn("Could not delete previous Cloudinary asset:", cloudErr.message);
      }
    }

    mediaUrl = result.secure_url;
    publicId = result.public_id;
    if (result.resource_type === "video") {
      mediaType = "video";
    }
  }

  const cleanDisplay = sanitizeDisplay(display);

  // 2. If record exists in DB, update it
  if (existingMedia) {
    if (mediaUrl) existingMedia.url = mediaUrl;
    if (publicId) existingMedia.publicId = publicId;
    if (mediaType) existingMedia.type = mediaType;
    if (category) existingMedia.category = targetCategory;
    if (title !== undefined) existingMedia.title = title.trim();
    if (caption !== undefined) existingMedia.caption = caption.trim();
    if (meta !== undefined) existingMedia.meta = meta.trim();
    if (cleanDisplay) existingMedia.display = cleanDisplay;

    const updated = await existingMedia.save();
    return res.status(200).json(
      new ApiResponse(200, updated, "Media asset updated successfully")
    );
  }

  // 3. If baseline asset edited for the first time, persist new baseline override in MongoDB
  const newBaselineOverride = await Media.create({
    url: mediaUrl || "",
    publicId,
    type: mediaType,
    category: targetCategory,
    title: title !== undefined ? title.trim() : "",
    caption: caption !== undefined ? caption.trim() : "",
    meta: meta !== undefined ? meta.trim() : "",
    isBaseline: true,
    baselineId: id,
    ...(cleanDisplay ? { display: cleanDisplay } : {}),
  });

  return res.status(200).json(
    new ApiResponse(200, newBaselineOverride, "Baseline asset customized successfully")
  );
});

/**
 * @route   PATCH /api/media/:id/display or PATCH /api/media/:id
 * @desc    Update framing and display positioning without modifying other metadata
 * @access  Protected (Admin)
 */
const updateMediaDisplay = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const mongoose = require("mongoose");
  const cleanDisplay = sanitizeDisplay(req.body.display || req.body);

  if (!cleanDisplay) {
    throw new ApiError(400, "Valid display framing settings are required (fit, position, zoom)");
  }

  let existingMedia = null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    existingMedia = await Media.findById(id);
  }
  if (!existingMedia) {
    existingMedia = await Media.findOne({ baselineId: id });
  }

  if (existingMedia) {
    existingMedia.display = cleanDisplay;
    const updated = await existingMedia.save();
    return res.status(200).json(
      new ApiResponse(200, updated, "Media display framing updated successfully")
    );
  }

  // Baseline item being framed for the first time
  const { url, type, category, title, caption, meta } = req.body;
  const newBaselineOverride = await Media.create({
    url: url || "",
    publicId: "",
    type: type || "photo",
    category: category ? category.toLowerCase().trim() : "weddings",
    title: title || "",
    caption: caption || "",
    meta: meta || "",
    isBaseline: true,
    baselineId: id,
    display: cleanDisplay,
  });

  return res.status(200).json(
    new ApiResponse(200, newBaselineOverride, "Baseline display framing saved successfully")
  );
});

/**
 * @route   DELETE /api/media/:id
 * @desc    Delete media from database and Cloudinary storage, or reset baseline override
 * @access  Protected (Admin)
 */
const deleteMedia = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const mongoose = require("mongoose");

  let media = null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    media = await Media.findById(id);
  }
  if (!media) {
    media = await Media.findOne({ baselineId: id });
  }

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
  await Media.findByIdAndDelete(media._id);

  return res.status(200).json(
    new ApiResponse(200, { id, baselineId: media.baselineId, category: media.category }, "Media item deleted successfully")
  );
});

module.exports = {
  getAllMedia,
  getMediaByCategory,
  createMedia,
  updateMedia,
  updateMediaDisplay,
  deleteMedia,
};
