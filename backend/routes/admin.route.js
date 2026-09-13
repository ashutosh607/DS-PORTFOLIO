const express = require("express");
const { login, logout, getMe } = require("../controllers/admin.controller");
const { verifyAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

// Public login & logout
router.post("/login", login);
router.post("/logout", logout);

// Protected session status
router.get("/me", verifyAdmin, getMe);

module.exports = router;
