const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    inquiryId: {
      type: String,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Client email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    eventType: {
      type: String,
      default: "Wedding",
    },
    eventDate: {
      type: String,
    },
    duration: {
      type: String,
    },
    location: {
      type: String,
    },
    collectionTitle: {
      type: String,
    },
    disciplines: {
      type: [String],
      default: [],
    },
    budget: {
      type: String,
    },
    message: {
      type: String,
    },
    source: {
      type: String,
    },
    channel: {
      type: String,
      enum: ["whatsapp", "email", "direct"],
      default: "email",
    },
    recipientEmail: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["new", "contacted", "confirmed", "archived"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Inquiry", inquirySchema);
