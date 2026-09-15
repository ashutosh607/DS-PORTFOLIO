const rateLimit = require("express-rate-limit");

/**
 * Strict rate limiter for sensitive authentication endpoints (e.g. login).
 * Default: 5 failed attempts per IP address per 15-minute window.
 * Successful logins are NOT penalized (skipSuccessfulRequests: true).
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: Number(process.env.AUTH_RATE_LIMIT_MAX) || 5, // 5 failed attempts max
  skipSuccessfulRequests: true, // Only failed login attempts count against the limit!
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json({
      statusCode: 429,
      success: false,
      message: "Too many failed login attempts from this IP. Please try again after 15 minutes.",
      errors: ["Rate limit exceeded. Maximum 5 failed attempts allowed per 15 minutes."],
    });
  },
});

/**
 * Global rate limiter for all standard API endpoints.
 * Protects against DDoS while allowing legitimate browsing (categories, media, gallery).
 */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: Number(process.env.GLOBAL_RATE_LIMIT_MAX) || 300, // 300 requests per 15 min for normal browsing
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json({
      statusCode: 429,
      success: false,
      message: "Too many requests from this IP address. Please try again after 15 minutes.",
      errors: ["Global rate limit exceeded."],
    });
  },
});

module.exports = {
  authLimiter,
  globalLimiter,
};
