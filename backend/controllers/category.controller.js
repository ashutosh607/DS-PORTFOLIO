const Category = require("../models/category.model");
const Media = require("../models/media.model");
const Service = require("../models/service.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { uploadOnCloudinary, deleteFromCloudinary } = require("../utils/cloudinary");

/**
 * Default Seed Categories used when database has no categories yet
 */
const DEFAULT_SEED_CATEGORIES = [
  {
    name: "Weddings",
    slug: "weddings",
    tagline: "Honest moments, beautifully preserved as they unfold.",
    quote: "A love story, in every frame.",
    medium: "Leica M11 · 35mm Summilux & 50mm Noctilux",
    location: "Lake Como & Private Estates",
    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
    order: 1,
  },
  {
    name: "Pre-wedding",
    slug: "pre-wedding",
    tagline: "Intimate anticipation before the grand celebration.",
    quote: "Quiet chapters before the vows.",
    medium: "Hasselblad H6D · Natural Ambient Glow",
    location: "Cap d’Antibes & Parisian Terraces",
    coverImage: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop",
    order: 2,
  },
  {
    name: "Birthdays",
    slug: "birthdays",
    tagline: "Milestone celebrations, laughter, and timeless nostalgia.",
    quote: "Moments of joy etched forever.",
    medium: "Leica SL2 · 50mm F/1.2 & 28mm Elmarit",
    location: "Hôtel Particulier & Private Salons",
    coverImage: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop",
    order: 3,
  },
  {
    name: "Portraits",
    slug: "portraits",
    tagline: "Authentic presence, evocative gazes, and nuanced light.",
    quote: "Soulful character in every glance.",
    medium: "Hasselblad 503CW · Carl Zeiss 80mm Planar",
    location: "Paris Atelier & Natural Light Daylight Studio",
    coverImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
    order: 4,
  },
  {
    name: "Events",
    slug: "events",
    tagline: "Atmospheric galas, spatial depth, and unstaged energy.",
    quote: "The living pulse of celebrated evenings.",
    medium: "Leica Q3 · 28mm Summilux & Leica M11",
    location: "Palais Brongniart & Private Châteaux",
    coverImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop",
    order: 5,
  },
  {
    name: "Commercial",
    slug: "commercial",
    tagline: "Haute editorial campaigns, luxury objects, and spatial poetics.",
    quote: "Purity of form, shadow, and tactile desire.",
    medium: "Phase One IQ4 150MP & Schneider Kreuznach",
    location: "Atelier Minimaliste & Concept Showrooms",
    coverImage: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop",
    order: 6,
  },
];

/**
 * @route   GET /api/categories
 * @desc    Get all categories (seeds default ones if collection is empty)
 * @access  Public
 */
const getAllCategories = asyncHandler(async (req, res) => {
  let categories = await Category.find().sort({ order: 1, createdAt: 1 });

  // Auto-seed default categories if database is currently empty
  if (!categories || categories.length === 0) {
    try {
      await Category.insertMany(DEFAULT_SEED_CATEGORIES);
      categories = await Category.find().sort({ order: 1, createdAt: 1 });
    } catch {
      return res.status(200).json(
        new ApiResponse(200, DEFAULT_SEED_CATEGORIES, "Default categories served")
      );
    }
  }

  return res.status(200).json(
    new ApiResponse(200, categories, "Categories retrieved successfully")
  );
});

/**
 * @route   POST /api/categories
 * @desc    Create new collection category
 * @access  Protected (Admin)
 */
const createCategory = asyncHandler(async (req, res) => {
  const { name, tagline, quote, medium, location, order } = req.body;
  let slug = req.body.slug ? req.body.slug.toLowerCase().trim() : "";

  if (!name || !name.trim()) {
    throw new ApiError(400, "Category name is required");
  }

  // Derive slug if not provided
  if (!slug) {
    slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  // Validate slug format
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new ApiError(400, "Invalid slug format: lowercase alphanumeric characters and hyphens only");
  }

  // Check if category slug already exists
  const existing = await Category.findOne({ slug });
  if (existing) {
    throw new ApiError(400, `Category with slug "${slug}" already exists`);
  }

  let coverImage = req.body.coverImage ? req.body.coverImage.trim() : "";
  let publicId = "";

  // Handle uploaded cover image file via multipart/form-data
  if (req.file) {
    const folder = `ds_portfolio/categories/${slug}`;
    const result = await uploadOnCloudinary(req.file.path, folder);

    if (!result || !result.secure_url) {
      throw new ApiError(500, "Failed to upload category cover to Cloudinary");
    }

    coverImage = result.secure_url;
    publicId = result.public_id;
  }

  if (!coverImage) {
    throw new ApiError(400, "Category cover photo is required (upload file or provide image URL)");
  }

  // Position newly created category after existing categories if order not explicitly given
  let categoryOrder = order !== undefined ? Number(order) : undefined;
  if (categoryOrder === undefined) {
    const highestOrderCat = await Category.findOne().sort({ order: -1 });
    categoryOrder = highestOrderCat && highestOrderCat.order ? highestOrderCat.order + 1 : 10;
  }

  let parsedCreateDisplay = { fit: "cover", position: { x: 50, y: 50 }, zoom: 1 };
  const rawCreateDisplay = req.body.display ?? req.body.coverDisplay;
  if (rawCreateDisplay !== undefined) {
    try {
      const candidate =
        typeof rawCreateDisplay === "string"
          ? JSON.parse(rawCreateDisplay)
          : rawCreateDisplay;
      if (candidate && typeof candidate === "object") {
        parsedCreateDisplay = {
          fit: candidate.fit === "contain" || candidate.fit === "fit" ? "contain" : "cover",
          position: {
            x: typeof candidate.position?.x === "number" ? Math.max(0, Math.min(100, candidate.position.x)) : 50,
            y: typeof candidate.position?.y === "number" ? Math.max(0, Math.min(100, candidate.position.y)) : 50,
          },
          zoom: typeof candidate.zoom === "number" && candidate.zoom >= 1 ? Math.min(3, candidate.zoom) : 1,
        };
      }
    } catch {
      // Keep default display
    }
  }

  const newCategory = await Category.create({
    name: name.trim(),
    slug,
    coverImage,
    publicId,
    tagline: tagline ? tagline.trim() : "",
    quote: quote ? quote.trim() : "",
    medium: medium ? medium.trim() : "",
    location: location ? location.trim() : "",
    order: categoryOrder,
    display: parsedCreateDisplay,
    coverDisplay: parsedCreateDisplay,
  });

  return res.status(201).json(
    new ApiResponse(201, newCategory, "Category created successfully")
  );
});

/**
 * @route   PUT /api/categories/:id
 * @desc    Update collection category
 * @access  Protected (Admin)
 */
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, tagline, quote, medium, location, order } = req.body;
  const mongoose = require("mongoose");

  let category = null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    category = await Category.findById(id);
  }
  if (!category) {
    category = await Category.findOne({ slug: id.toLowerCase().trim() });
  }
  if (!category && !isNaN(Number(id))) {
    category = await Category.findOne({ order: Number(id) });
  }

  // If categories not yet seeded in MongoDB (or this specific baseline category wasn't seeded yet), auto-seed and try finding again
  if (!category) {
    const totalCount = await Category.countDocuments();
    if (totalCount === 0) {
      await Category.insertMany(DEFAULT_SEED_CATEGORIES);
    } else {
      const normalizedId = id.toLowerCase().trim();
      const matchingSeed = DEFAULT_SEED_CATEGORIES.find(
        (seed) =>
          seed.slug === normalizedId ||
          (!isNaN(Number(id)) && seed.order === Number(id)) ||
          seed.name.toLowerCase() === normalizedId
      );
      if (matchingSeed) {
        const existingSeed = await Category.findOne({ slug: matchingSeed.slug });
        if (!existingSeed) {
          category = await Category.create(matchingSeed);
        } else {
          category = existingSeed;
        }
      }
    }

    if (!category) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        category = await Category.findById(id);
      }
      if (!category) {
        category = await Category.findOne({ slug: id.toLowerCase().trim() });
      }
      if (!category && !isNaN(Number(id))) {
        category = await Category.findOne({ order: Number(id) });
      }
    }
  }

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const oldCoverImage = category.coverImage;
  let coverImage = req.body.coverImage ? req.body.coverImage.trim() : category.coverImage;
  let publicId = category.publicId;

  // Handle new uploaded cover file
  if (req.file) {
    const folder = `ds_portfolio/categories/${category.slug}`;
    const result = await uploadOnCloudinary(req.file.path, folder);

    if (!result || !result.secure_url) {
      throw new ApiError(500, "Failed to upload category cover to Cloudinary");
    }

    // Delete old cover from Cloudinary if exists
    if (category.publicId) {
      try {
        await deleteFromCloudinary(category.publicId, "image");
      } catch (cloudErr) {
        console.warn("Could not delete previous category cover:", cloudErr.message);
      }
    }

    coverImage = result.secure_url;
    publicId = result.public_id;
  }

  const oldSlug = category.slug;
  if (name !== undefined) category.name = name.trim();

  let targetSlug = req.body.slug ? req.body.slug.toLowerCase().trim() : '';
  if (!targetSlug && name && name.trim() && name.trim() !== category.name) {
    targetSlug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }

  let slugChanged = false;
  if (targetSlug && targetSlug !== oldSlug) {
    if (!/^[a-z0-9-]+$/.test(targetSlug)) {
      throw new ApiError(400, "Invalid slug format: lowercase alphanumeric characters and hyphens only");
    }
    const duplicate = await Category.findOne({ slug: targetSlug, _id: { $ne: category._id } });
    if (duplicate) {
      throw new ApiError(400, `Category slug "${targetSlug}" already exists`);
    }
    category.slug = targetSlug;
    slugChanged = true;
  }

  category.coverImage = coverImage;
  category.publicId = publicId;
  if (tagline !== undefined) category.tagline = tagline.trim();
  if (quote !== undefined) category.quote = quote.trim();
  if (medium !== undefined) category.medium = medium.trim();
  if (location !== undefined) category.location = location.trim();
  if (order !== undefined) category.order = Number(order);
  if (req.body.supporting !== undefined) {
    try {
      category.supporting = typeof req.body.supporting === 'string'
        ? JSON.parse(req.body.supporting)
        : req.body.supporting;
      category.markModified("supporting");
    } catch {
      // Keep existing supporting
    }
  }
  if (req.body.featured !== undefined) {
    try {
      category.featured = typeof req.body.featured === 'string'
        ? JSON.parse(req.body.featured)
        : req.body.featured;
      category.markModified("featured");
    } catch {
      // Keep existing featured
    }
  }
  const rawDisplayInput = req.body.display ?? req.body.coverDisplay;
  if (rawDisplayInput !== undefined) {
    try {
      const parsedDisplay = typeof rawDisplayInput === 'string'
        ? JSON.parse(rawDisplayInput)
        : rawDisplayInput;
      if (parsedDisplay && typeof parsedDisplay === 'object') {
        const sanitizedDisplay = {
          fit: parsedDisplay.fit === 'contain' || parsedDisplay.fit === 'fit' ? 'contain' : 'cover',
          position: {
            x: typeof parsedDisplay.position?.x === 'number' ? Math.max(0, Math.min(100, parsedDisplay.position.x)) : 50,
            y: typeof parsedDisplay.position?.y === 'number' ? Math.max(0, Math.min(100, parsedDisplay.position.y)) : 50,
          },
          zoom: typeof parsedDisplay.zoom === 'number' && parsedDisplay.zoom >= 1 ? Math.min(3, parsedDisplay.zoom) : 1,
        };
        category.display = sanitizedDisplay;
        category.coverDisplay = sanitizedDisplay;
        category.markModified("display");
        category.markModified("coverDisplay");
        if (category.featured && typeof category.featured === 'object') {
          category.featured = {
            ...category.featured,
            image: coverImage,
            display: sanitizedDisplay,
          };
          category.markModified("featured");
        }
      }
    } catch {
      // Keep existing display
    }
  }

  const updatedCategory = await category.save();

  // If slug was changed, cascade rename to all associated Media and Services
  if (slugChanged && oldSlug && category.slug) {
    try {
      await Media.updateMany(
        { category: oldSlug },
        { $set: { category: category.slug } }
      );
      // Update baseline IDs referencing the old slug
      await Media.updateMany(
        { baselineId: `seed-cover-${oldSlug}` },
        { $set: { baselineId: `seed-cover-${category.slug}` } }
      );
      const oldSupItems = await Media.find({ baselineId: { $regex: `^seed-sup-${oldSlug}-` } });
      for (const item of oldSupItems) {
        item.baselineId = item.baselineId.replace(`seed-sup-${oldSlug}-`, `seed-sup-${category.slug}-`);
        await item.save();
      }
    } catch (mediaErr) {
      console.warn("Could not cascade category slug to Media:", mediaErr.message);
    }

    try {
      await Service.updateMany(
        { category: oldSlug },
        { $set: { category: category.slug } }
      );
    } catch (serviceErr) {
      console.warn("Could not cascade category slug to Service:", serviceErr.message);
    }
  }

  // Sync any existing baseline cover overrides or matching cover media items so media queries immediately reflect the new cover & framing
  try {
    const paddedOrder = category.order ? String(category.order).padStart(2, "0") : "";
    const coverBaselineIds = [
      `seed-cover-${category.slug}`,
      ...(oldSlug ? [`seed-cover-${oldSlug}`] : []),
      `seed-cover-${category.order}`,
      ...(paddedOrder ? [`seed-cover-${paddedOrder}`] : []),
    ];
    const mediaSetFields = {
      url: coverImage,
      publicId: publicId || "",
    };
    if (category.display && typeof category.display === "object") {
      mediaSetFields.display = category.display;
    }
    await Media.updateMany(
      { baselineId: { $in: coverBaselineIds } },
      { $set: mediaSetFields }
    );

    const coverUrls = [oldCoverImage, coverImage].filter(Boolean);
    const catSlugs = [category.slug, oldSlug].filter(Boolean);
    if (coverUrls.length > 0 && catSlugs.length > 0) {
      await Media.updateMany(
        { category: { $in: catSlugs }, url: { $in: coverUrls } },
        {
          $set: {
            url: coverImage,
            ...(category.display && typeof category.display === "object"
              ? { display: category.display }
              : {}),
          },
        }
      );
    }
  } catch (err) {
    console.warn("Could not sync baseline cover override in Media:", err.message);
  }

  return res.status(200).json(
    new ApiResponse(200, updatedCategory, "Category updated successfully")
  );
});

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete collection category
 * @access  Protected (Admin)
 */
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const mongoose = require("mongoose");

  let category = null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    category = await Category.findById(id);
  }
  if (!category) {
    category = await Category.findOne({ slug: id.toLowerCase().trim() });
  }
  if (!category && !isNaN(Number(id))) {
    category = await Category.findOne({ order: Number(id) });
  }

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  // Remove cover from Cloudinary if stored
  if (category.publicId) {
    try {
      await deleteFromCloudinary(category.publicId, "image");
    } catch (cloudErr) {
      console.warn("Cloudinary delete warning for category cover:", cloudErr.message);
    }
  }

  await Category.findByIdAndDelete(category._id);

  return res.status(200).json(
    new ApiResponse(200, { id: category._id, slug: category.slug }, "Category deleted successfully")
  );
});

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
