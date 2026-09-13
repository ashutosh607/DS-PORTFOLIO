const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@dsphotography.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123456";
const JWT_SECRET = process.env.JWT_SECRET || "ds_portfolio_atelier_secret_jwt_key_2026";

/**
 * @route   POST /api/admin/login
 * @desc    Authenticate admin and set HTTP-only cookie
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // Strictly validate credentials against server environment
  const targetEmail = process.env.ADMIN_EMAIL || ADMIN_EMAIL;
  const targetPassword = process.env.ADMIN_PASSWORD || ADMIN_PASSWORD;

  if (email.trim().toLowerCase() !== targetEmail.trim().toLowerCase() || password !== targetPassword) {
    throw new ApiError(401, "Invalid administrator credentials");
  }

  // Generate 7-day JWT session token
  const token = jwt.sign(
    {
      email: targetEmail,
      role: "admin",
    },
    process.env.JWT_SECRET || JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  };

  res.cookie("adminToken", token, cookieOptions);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        email: targetEmail,
        role: "admin",
        token, // Also return token for environments where cookies might be blocked
      },
      "Admin login successful"
    )
  );
});

/**
 * @route   POST /api/admin/logout
 * @desc    Clear admin session cookie
 * @access  Public
 */
const logout = asyncHandler(async (req, res) => {
  res.clearCookie("adminToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });

  return res.status(200).json(new ApiResponse(200, null, "Admin logged out successfully"));
});

/**
 * @route   GET /api/admin/me
 * @desc    Verify current session and return admin profile
 * @access  Protected (Admin)
 */
const getMe = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        email: req.admin.email,
        role: req.admin.role,
      },
      "Admin session active"
    )
  );
});

module.exports = {
  login,
  logout,
  getMe,
};
