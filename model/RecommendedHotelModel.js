const mongoose = require("mongoose");

const RecommendedHotelSchema = mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "hotel",
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const RecommendedHotelModel = mongoose.model(
  "RecommendedHotel",
  RecommendedHotelSchema
);
module.exports = RecommendedHotelModel;
