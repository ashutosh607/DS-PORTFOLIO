const ApiError = require("../utils/ApiError");
const mongoose = require("mongoose");

/**
 * Deep check for prohibited NoSQL injection operators ($ and . keys)
 */
function hasNoSqlInjection(obj) {
  if (!obj || typeof obj !== "object") return false;

  for (const key of Object.keys(obj)) {
    if (key.startsWith("$") || key.includes(".")) {
      return true;
    }
    if (typeof obj[key] === "object" && obj[key] !== null) {
      if (hasNoSqlInjection(obj[key])) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Middleware to reject NoSQL injection attempts in body, query, or params
 */
const sanitizeNoSql = (req, res, next) => {
  if (hasNoSqlInjection(req.body) || hasNoSqlInjection(req.query) || hasNoSqlInjection(req.params)) {
    return next(new ApiError(400, "Malformed request: NoSQL injection patterns detected"));
  }
  next();
};

/**
 * Middleware to validate MongoDB ObjectId or slug parameters to prevent CastErrors or injection
 */
const validateIdOrSlug = (paramName = "id") => {
  return (req, res, next) => {
    const val = req.params[paramName];
    if (!val) return next();

    const isObjectId = mongoose.Types.ObjectId.isValid(val);
    const isSafeSlug = /^[a-zA-Z0-9_\-]+$/.test(val);

    if (!isObjectId && !isSafeSlug) {
      return next(new ApiError(400, `Invalid ${paramName} format: must be a valid identifier or slug`));
    }
    next();
  };
};

/**
 * Middleware to sanitize user string inputs to strip HTML script injections
 */
const sanitizeInputs = (req, res, next) => {
  const sanitize = (val) => {
    if (typeof val === "string") {
      // Strip script tags and dangerous HTML execution tags
      return val
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/javascript:[^"']*/gi, "")
        .trim();
    }
    if (typeof val === "object" && val !== null) {
      for (const k of Object.keys(val)) {
        val[k] = sanitize(val[k]);
      }
    }
    return val;
  };

  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  next();
};

module.exports = {
  sanitizeNoSql,
  validateIdOrSlug,
  sanitizeInputs,
};
