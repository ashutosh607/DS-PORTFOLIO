const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const JWT_SECRET = process.env.JWT_SECRET || "ds_portfolio_atelier_secret_jwt_key_2026";

/**
 * @route   POST /api/admin/login
 * @desc    Authenticate admin against MongoDB Atlas using bcrypt hashed credentials
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Find admin document in MongoDB Atlas
  const admin = await Admin.findOne({ email: normalizedEmail });

  if (!admin) {
    throw new ApiError(401, "Invalid administrator credentials");
  }

  // Compare candidate password with bcrypt hash in database
  const isPasswordValid = await admin.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid administrator credentials");
  }

  // Generate 7-day JWT session token
  const token = jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      role: admin.role || "admin",
    },
    JWT_SECRET,
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
        id: admin._id,
        email: admin.email,
        role: admin.role || "admin",
        token,
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
 * @desc    Verify current session against MongoDB Atlas and return admin profile
 * @access  Protected (Admin)
 */
const getMe = asyncHandler(async (req, res) => {
  let admin = null;
  if (req.admin?.id) {
    admin = await Admin.findById(req.admin.id).select("-password");
  } else if (req.admin?.email) {
    admin = await Admin.findOne({ email: req.admin.email }).select("-password");
  }

  if (!admin) {
    throw new ApiError(401, "Admin account not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        id: admin._id,
        email: admin.email,
        role: admin.role,
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
