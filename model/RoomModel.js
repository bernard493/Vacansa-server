const mongoose = require("mongoose");

const RoomSchema = mongoose.Schema(
  {
    // to add hotel_id of hotel creating/saving data
    hotel_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    roomTitle: {
      type: String,
      require: [true, "Please enter a Room  name"],
    },
    roomsAvailable: {
      type: Number,
      min: [1, "Minimum one room is needed for rooms Available ."],
    },
    image: {
      type: [String],
    },
    bed: {
      type: String,
      require: [true, "Please enter a room bed"],
    },
    guests: {
      type: Number,
      require: [true, "Please enter a room guests number"],
    },
    wifi: {
      type: Boolean,
      require: true,
    },
    squareMeter: {
      type: String,
      require: [true, "Please enter a room  squareMeter"],
    },
    price: {
      type: Number,
      require: [true, "Please enter a room  Price"],
    },
    discountPer: {
      type: Number,
    },
    roomDescription: {
      type: String,
      default: "No description available",
    },
  },
  {
    timestamps: true,
  }
);

const RoomModel = mongoose.model("room", RoomSchema);
module.exports = RoomModel;
