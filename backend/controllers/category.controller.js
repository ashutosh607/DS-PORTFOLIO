const Category = require("../models/category.model");
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

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

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

  if (name !== undefined) category.name = name.trim();
  if (req.body.slug !== undefined) {
    const newSlug = req.body.slug.toLowerCase().trim();
    if (newSlug && newSlug !== category.slug) {
      if (!/^[a-z0-9-]+$/.test(newSlug)) {
        throw new ApiError(400, "Invalid slug format: lowercase alphanumeric characters and hyphens only");
      }
      const duplicate = await Category.findOne({ slug: newSlug, _id: { $ne: category._id } });
      if (duplicate) {
        throw new ApiError(400, `Category slug "${newSlug}" already exists`);
      }
      category.slug = newSlug;
    }
  }

  category.coverImage = coverImage;
  category.publicId = publicId;
  if (tagline !== undefined) category.tagline = tagline.trim();
  if (quote !== undefined) category.quote = quote.trim();
  if (medium !== undefined) category.medium = medium.trim();
  if (location !== undefined) category.location = location.trim();
  if (order !== undefined) category.order = Number(order);

  const updatedCategory = await category.save();

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
