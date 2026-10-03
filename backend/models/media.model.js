const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, "Media URL is required"],
      trim: true,
    },
    publicId: {
      type: String,
      default: "",
      trim: true,
    },
    type: {
      type: String,
      enum: ["photo", "video"],
      default: "photo",
    },
    category: {
      type: String,
      required: [true, "Category slug is required"],
      trim: true,
      lowercase: true,
      index: true,
    },
    title: {
      type: String,
      default: "",
      trim: true,
    },
    caption: {
      type: String,
      default: "",
      trim: true,
    },
    meta: {
      type: String,
      default: "",
      trim: true,
    },
    isBaseline: {
      type: Boolean,
      default: false,
    },
    baselineId: {
      type: String,
      default: "",
      index: true,
    },
    display: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({
        fit: "cover",
        position: { x: 50, y: 50 },
        zoom: 1,
      }),
    },
  },
  {
    timestamps: true,
  }
);

const Media = mongoose.model("Media", mediaSchema);
module.exports = Media;
