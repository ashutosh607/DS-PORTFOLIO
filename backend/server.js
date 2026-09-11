require("dotenv").config();

const dns = require("dns");
// Set reliable DNS servers for MongoDB SRV lookups
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/error.middleware");
const ApiError = require("./utils/ApiError");

// Import routes
const healthRouter = require("./routes/health.route");
const uploadRouter = require("./routes/upload.route");

const app = express();
const PORT = process.env.PORT || 5000;

// Essential Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(express.static("public"));

// Root Welcome Route
app.get("/", (req, res) => {
  res.json({
    name: "DS Portfolio Backend API",
    status: "Active",
    version: "1.0.0",
    endpoints: {
      health: "/api/v1/health",
      uploadSingle: "POST /api/v1/upload/single",
      uploadMultiple: "POST /api/v1/upload/multiple",
      deleteFile: "DELETE /api/v1/upload/:publicId",
    },
  });
});

// API Routes
app.use("/api/v1/health", healthRouter);
app.use("/api/v1/upload", uploadRouter);

// Catch-all 404 handler for undefined routes
app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Connect to Database and start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`🔗 Health Check: http://localhost:${PORT}/api/v1/health`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB, server not started:", err);
  });

module.exports = app;