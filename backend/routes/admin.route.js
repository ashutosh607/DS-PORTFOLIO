const express = require("express");
const { login, logout, getMe } = require("../controllers/admin.controller");
const { verifyAdmin } = require("../middlewares/auth.middleware");

const { authLimiter } = require("../middlewares/rateLimiter.middleware");

const router = express.Router();

// Public login & logout with strict rate limiting
router.post("/login", authLimiter, login);
router.post("/logout", logout);

// Protected session status
router.get("/me", verifyAdmin, getMe);

module.exports = router;
