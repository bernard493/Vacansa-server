const expressAsyncHandler = require("express-async-handler");
const ReviewModel = require("../model/reviewModel");

// @POST Create Review
// Route /api/review/create-review
// Private Router
// Access user
const createReview = expressAsyncHandler(async (req, res) => {
  //  validate and sanitize the input to prevent SQL injection attacks.
  const { Hotel_id, message, rating } = req
    .sanitizeBody("Hotel_id")
    .escape("message")
    .toInt("rating").body;
    const id = req.user && req.user.id;

  if (!Hotel_id || !message || !rating || !id) {
    return res.status(400).json({
      message: "Please provide all required fields",
    });
  }
  try {
    // check if the hotel exists before creating a review
    const hotelExists = await HotelModel.exists({ _id: Hotel_id });
    if (!hotelExists) {
      return res.status(404).json({
        message: `No hotel found with id ${Hotel_id}`,
      });
    }
    const review = await ReviewModel.create({
      user: id,
      hotel: Hotel_id,
      message,
      rating,
    });
    if (!review) {
      return res.status(500).json({
        message: "Please cant create a review now try again later ",
      });
    }

    res.status(200).json({ message: 'Review created successfully', review });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create review",
      error: error.message,
    });
  }
});
// @POST Create Review
// Route /api/review/get-review/hotel_id
// Private Router
// Access user
const getAllReviews = expressAsyncHandler(async (req, res) => {
  const { hotel_id } = req.params;
  if (!hotel_id) {
    return res.status(401).json({
      message: "Please provide hotel id in params",
    });
  }

  const allReview = await ReviewModel.find({ hotel: hotel_id }).populate({
    path: "user",
    select: "name avatar",
  });

  if (!allReview) {
    return res.status(401).json({
      message: `No review found with id ${hotel_id}`,
    });
  }
  res
    .status(200)
    .json({ totalCount: allReview.length, success: true, review: allReview });
});
module.exports = { createReview, getAllReviews };
