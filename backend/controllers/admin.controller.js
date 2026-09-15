const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const bcrypt = require("bcryptjs");

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new ApiError(500, "JWT_SECRET configuration is missing on the server");
  }
  return secret;
};

// Constant dummy hash for constant-time comparison when email not found
const DUMMY_HASH = "$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012345";

/**
 * @route   POST /api/admin/login
 * @desc    Authenticate admin against MongoDB Atlas using bcrypt hashed credentials
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || typeof email !== "string" || typeof password !== "string") {
    throw new ApiError(400, "Valid email and password strings are required");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    throw new ApiError(400, "Invalid email address format");
  }

  // Find admin document in MongoDB Atlas
  const admin = await Admin.findOne({ email: normalizedEmail });

  // Mitigate user enumeration via uniform timing
  let isPasswordValid = false;
  if (admin) {
    isPasswordValid = await admin.isPasswordCorrect(password);
  } else {
    // Perform dummy bcrypt comparison to ensure uniform response time
    await bcrypt.compare(password, DUMMY_HASH).catch(() => {});
  }

  if (!admin || !isPasswordValid) {
    throw new ApiError(401, "Invalid administrator credentials");
  }

  // Generate 4-hour JWT session token
  const tokenExpiry = process.env.JWT_EXPIRES_IN || "4h";
  const token = jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      role: admin.role || "admin",
    },
    getJwtSecret(),
    {
      expiresIn: tokenExpiry,
    }
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 4 * 60 * 60 * 1000, // 4 hours
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
