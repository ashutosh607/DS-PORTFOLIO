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
const adminRouter = require("./routes/admin.route");
const mediaRouter = require("./routes/media.route");

const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure public directories exist
const tempDir = path.resolve(__dirname, "public/temp");
const uploadsDir = path.resolve(__dirname, "public/uploads");
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Essential Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use("/uploads", express.static(uploadsDir));
app.use(express.static("public"));

// Root Welcome Route
app.get("/", (req, res) => {
  res.json({
    name: "DS Portfolio Backend API",
    status: "Active",
    version: "1.0.0",
    endpoints: {
      health: "/api/v1/health",
      admin: "/api/admin",
      media: "/api/media",
      uploadSingle: "POST /api/v1/upload/single",
    },
  });
});

// API Routes
app.use("/api/v1/health", healthRouter);
app.use("/api/v1/upload", uploadRouter);
app.use("/api/admin", adminRouter);
app.use("/api/media", mediaRouter);

// Catch-all 404 handler for undefined routes
app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// Centralized Error Handling Middleware
app.use(errorHandler);

const initAdminAccount = require("./config/initAdmin");

// Connect to Database and start server
connectDB()
  .then(async () => {
    // Automatically synchronize and bcrypt hash admin credentials from .env to MongoDB Atlas
    await initAdminAccount();

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`🔗 Health Check: http://localhost:${PORT}/api/v1/health`);
    });
  })
  .catch((err) => {
    console.warn("⚠️  MongoDB connection failed:", err.message);
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} (Database offline - connect MongoDB to persist media)`);
      console.log(`🔗 Health Check: http://localhost:${PORT}/api/v1/health`);
    });
  });


module.exports = app;