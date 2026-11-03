const express = require("express");

const router = express.Router();

// Health Check
router.get("/", (_req, res) => {
  res
    .status(200)
    .json({ success: true, status: "ok", timestamp: new Date().toISOString() });
});

module.exports = router;
