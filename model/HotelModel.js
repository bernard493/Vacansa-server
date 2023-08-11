const mongoose = require("mongoose");

const hotelScheme = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Please enter a Name"],
    },
    email: {
      type: String,
      require: [true, "Please Enter your email"],
      unique: [true, "Please  email already taken"],
    },
    address: {
      type: String,
      require: [true, "Please Enter your address"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    password: {
      type: String,
      required: [true, "Password is Required"],
    },
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    image: {
      type: [String],
    },
    startPrice: {
      type: Number,
    },
    phoneNumber: {
      type: Number,
    },
    lati: {
      type: Number,
    },
    longit: {
      type: Number,
    },
    facilities: {
      type: [String],
    },
    overview: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const HotelModel = mongoose.model("hotel", hotelScheme);
module.exports = HotelModel;
