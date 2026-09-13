const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Middleware to verify admin authentication from HTTP-only cookie or Authorization header.
 */
const verifyAdmin = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.adminToken;

  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(401, "Unauthorized: Admin session required");
  }

  try {
    const secret = process.env.JWT_SECRET || "ds_portfolio_atelier_secret_jwt_key_2026";
    const decoded = jwt.verify(token, secret);

    if (decoded.role !== "admin") {
      throw new ApiError(403, "Forbidden: Admin privileges required");
    }

    req.admin = decoded;
    next();
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(401, "Invalid or expired admin session. Please log in again.");
  }
});

module.exports = {
  verifyAdmin,
};
