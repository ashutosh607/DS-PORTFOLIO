const express = require("express");
const router = express.Router();
const { createInquiry, getInquiries } = require("../controllers/inquiry.controller");

// Public inquiry submission endpoint
router.post("/", createInquiry);

// Get inquiries (can be accessed by admin)
router.get("/", getInquiries);

module.exports = router;
