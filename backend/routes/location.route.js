const express = require("express");
const { searchLocations } = require("../controllers/location.controller");

const router = express.Router();

// Public location search with dynamic geocoding & photography recommendations
// Route: GET /api/locations/search?q=Raigad
router.get("/search", searchLocations);

module.exports = router;

