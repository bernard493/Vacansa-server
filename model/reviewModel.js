const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "hotel",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      require: true,
    },
  },
  { timestamps: true }
);

const ReviewModel = mongoose.model("review", reviewSchema);
module.exports = ReviewModel;
