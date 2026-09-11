const express = require("express");
const mongoose = require("mongoose");
const ApiResponse = require("../utils/ApiResponse");

const router = express.Router();

router.get("/", (req, res) => {
  const dbStatusMap = {
    0: "Disconnected",
    1: "Connected",
    2: "Connecting",
    3: "Disconnecting",
  };

  const healthData = {
    status: "OK",
    uptime: `${Math.floor(process.uptime())} seconds`,
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatusMap[mongoose.connection.readyState] || "Unknown",
      readyState: mongoose.connection.readyState,
    },
  };

  return res.status(200).json(new ApiResponse(200, healthData, "Server is healthy"));
});

module.exports = router;
