const Inquiry = require("../models/inquiry.model");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { sendInquiryEmail } = require("../utils/emailService");

/**
 * Create new inquiry (from WhatsApp or Email form submission)
 */
exports.createInquiry = asyncHandler(async (req, res) => {
  const {
    inquiryId,
    name,
    email,
    phone,
    countryCode,
    eventType,
    eventDate,
    duration,
    location,
    collection: collectionTitle,
    disciplines,
    budget,
    message,
    source,
    channel,
  } = req.body;

  const fullPhone = phone ? (countryCode ? `${countryCode} ${phone}` : phone) : "";

  const newInquiry = await Inquiry.create({
    inquiryId: inquiryId || `DS-${Date.now().toString().slice(-6)}`,
    name: name || "Anonymous Client",
    email: email || "unknown@domain.com",
    phone: fullPhone,
    eventType: eventType || "Wedding",
    eventDate: eventDate || "",
    duration: duration || "",
    location: location || "",
    collectionTitle: collectionTitle || "Signature",
    disciplines: Array.isArray(disciplines) ? disciplines : [],
    budget: budget || "",
    message: message || "",
    source: source || "Website",
    channel: channel || "email",
    recipientEmail: "ashutoshkadam2406@gmail.com",
  });

  // Automatically dispatch email notification to ashutoshkadam2406@gmail.com
  sendInquiryEmail(newInquiry).catch((err) => {
    console.error("Background email dispatch error:", err);
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newInquiry, "Inquiry recorded and automated email dispatched successfully"));
});

/**
 * Get all inquiries (for Admin Dashboard)
 */
exports.getInquiries = asyncHandler(async (req, res) => {
  const inquiries = await Inquiry.find().sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponse(200, inquiries, "Inquiries retrieved successfully"));
});
