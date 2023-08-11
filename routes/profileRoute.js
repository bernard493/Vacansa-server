const express = require("express");
const {
  getUserProfile,
  getHotelProfile,
  updateUserProfile,
  updateHotelProfile,
  updateUserAvatar
} = require("../controllers/userProfileController");
const validateToken = require("../middleware/validateToken");
const uploads = require("../middleware/avatarUpload");
const router = express.Router();

// User Profile Rotes
// Get User Profile
router.get("/", validateToken, getUserProfile);
// UPDATE User Profile
router.put("/", validateToken, updateUserProfile);
router.post("/user/avatar", validateToken, uploads.single("avatar"), updateUserAvatar);

// Hotel Profile Routes
// Get Hotel Profile
router.get("/hotel", validateToken, getHotelProfile);
// UPDATE Hotel Profile
router.put("/hotel", validateToken, updateHotelProfile);

module.exports = router;