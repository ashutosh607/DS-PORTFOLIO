const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      lowercase: true,
      index: true,
    },
    tier: {
      type: String,
      required: [true, "Tier name is required"],
      trim: true,
    },
    folioLabel: {
      type: String,
      trim: true,
      default: "",
    },
    eyebrow: {
      type: String,
      trim: true,
      default: "",
    },
    subtitle: {
      type: String,
      trim: true,
      default: "",
    },
    badge: {
      type: String,
      trim: true,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    imageTag: {
      type: String,
      trim: true,
      default: "",
    },
    price: {
      type: Number,
      default: null,
      min: [0, "Price cannot be negative"],
    },
    priceNote: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    privilegesLabel: {
      type: String,
      trim: true,
      default: "INCLUDED DELIVERABLES",
    },
    deliverables: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isRecommended: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for category-wise ordering
serviceSchema.index({ category: 1, order: 1 });

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
