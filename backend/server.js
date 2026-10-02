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
const categoryRouter = require("./routes/category.route");
const serviceRouter = require("./routes/service.route");
const inquiryRouter = require("./routes/inquiry.route");

const helmet = require("helmet");
const { globalLimiter } = require("./middlewares/rateLimiter.middleware");
const { sanitizeNoSql, sanitizeInputs } = require("./middlewares/sanitize.middleware");

const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

// Enable trust proxy for reverse proxies (Render, Vercel, Cloudflare, Nginx)
app.set("trust proxy", 1);

// Disable server technology fingerprinting
app.disable("x-powered-by");

// Ensure public directories exist
const tempDir = path.resolve(__dirname, "public/temp");
const uploadsDir = path.resolve(__dirname, "public/uploads");
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// 1. Helmet Security Headers (HSTS, nosniff, frameguard, etc.)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin images/assets for frontend
    contentSecurityPolicy: false, // Managed per need or disabled for pure API
  })
);

// 2. Strict CORS Configuration
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes("*")) {
        return callback(null, true);
      }
      return callback(new ApiError(403, "CORS origin blocked by security policy"));
    },
    credentials: true,
  })
);

// 3. Payload size limiting & body parsing (strict 100KB limit to prevent DoS)
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

// 4. Trap and reject malformed JSON syntax payloads with clean 400 Bad Request
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: "Malformed JSON payload in request body",
      errors: ["Invalid JSON syntax received"],
    });
  }
  next(err);
});

// 5. Input Sanitization (NoSQL injection prevention & XSS script tag stripping)
app.use(sanitizeNoSql);
app.use(sanitizeInputs);

app.use(cookieParser());
app.use("/uploads", express.static(uploadsDir));
app.use("/categories", express.static(path.resolve(uploadsDir, "ds_portfolio/categories")));
app.use(express.static("public"));

// 6. Global Rate Limiter for all API routes (protects existing and newly added endpoints)
app.use("/api", globalLimiter);

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
      categories: "/api/categories",
      uploadSingle: "POST /api/v1/upload/single",
    },
  });
});

// API Routes
app.use("/api/v1/health", healthRouter);
app.use("/api/v1/upload", uploadRouter);
app.use("/api/admin", adminRouter);
app.use("/api/media", mediaRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/services", serviceRouter);
app.use("/api/inquiries", inquiryRouter);

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