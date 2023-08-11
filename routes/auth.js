// userRoutes.js
const express = require("express");
const { registerUser,loginUser } = require("../controllers/authController");
const router = express.Router();

// routes

// register
router.post("/register", registerUser);

// login
router.post("/login",loginUser);


// hotelRoutes.js
const { registerHotel,loginHotel } = require("../controllers/authController");

// routes

// register
router.post("/register/hotel", registerHotel);

// login
router.post("/login/hotel",loginHotel);

module.exports = router;