const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema(
  {
    // to add hotel_id of hotel creating/saving data
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "hotel",
      require: true,
    },

    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "room",
      require: true,
    },
    checkingInDate: {
      type: String,
    },
    checkingOutDate: {
      type: String,
    },
    bookingName: {
      type: String,
      require: [true, "Please enter a Booking name"],
    },
    bookingEmail: {
      type: String,
      require: [true, "Please enter a Booking email"],
    },
    bookingNumber: {
      type: Number,
      require: [true, "Please enter a Booking  number"],
    },
    totalAmountPaid: {
      type: Number,
      require: [true, "Please enter a Booking  Price"],
    },
    paymentMethod: {
      type: String,
      enum: ["Paypal", "Credit Card", "Cash"],
      require: [true, "Please enter a Booking  Price"],
    },
    paymentStatus: {
      type: Boolean,
      required: [true, "Payment Status is not provided"],
      default: false,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "confirmed", "completed", "canceled", "on hold"],
    },
  },
  {
    timestamps: true,
  }
);

const OrderModel = mongoose.model("Order", OrderSchema);
module.exports = OrderModel;
