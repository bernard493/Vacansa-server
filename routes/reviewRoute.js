const express = require("express");
const Router = express.Router();
const validateToken = require("../middleware/validateToken");
const {
  createReview,
  getAllReviews,
} = require("../controllers/reviewController");

// Create review
Router.post("/create-review", validateToken, createReview);

// Get all reviews of hotel
Router.get("/get-review/:hotel_id", validateToken, getAllReviews);

module.exports = Router;
