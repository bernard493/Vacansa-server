const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateToken");
const {
  getallHotels,
  getHotelById,
  getAllPopularHotels,
  getRecommendedHotels,
  createPopularHotels,
  createRecommendedHotel,
} = require("../controllers/hotelsController");

// Get all hotels
router.get("/", validateToken, getallHotels);

// Create Popular Hotels based on user activity
router.post("/popular-hotel", createPopularHotels);

// Create Recommended Hotels based on user activity
router.post("/recommended-hotel", createRecommendedHotel);

// GET Popular Hotels
router.get("/popular-hotels", validateToken, getAllPopularHotels);

// GET Recommended Hotels
router.get("/recommended-hotels", validateToken, getRecommendedHotels);

// Get hotel by id
router.get("/:id", validateToken, getHotelById);

module.exports = router;