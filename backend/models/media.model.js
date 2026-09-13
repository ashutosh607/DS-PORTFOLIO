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
  },
  {
    timestamps: true,
  }
);

const Media = mongoose.model("Media", mediaSchema);
module.exports = Media;
