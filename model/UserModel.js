const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
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
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
    },
    avatar: {
      type: String,
    },
    phoneNumber: {
      type: String, // Improvement suggestion 1: Changed the type to String
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("user", UserSchema);
module.exports = User;