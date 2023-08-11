// WILL HANDLE ALL ERRORS FOR TRY CATCH BLOCK
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../model/UserModel");
const HotelModel = require("../model/HotelModel");
const Joi = require("joi");

// @POST Register User
// Route /api/auth/register
// Public Router
const registerUser = asyncHandler(async (req, res) => {
  const signUpSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(10).required(),
    name: Joi.string().required(),
    phoneNumber: Joi.string().required(),
  });
  const { error, value } = signUpSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  } else {
    const { name, email, password, phoneNumber } = req.body;
    // check if user already registered
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(400)
        .json({ message: "User already registered try new email" });
    }
    //  Hash password before creating user
    const hashedPassword = bcrypt.hashSync(password, 10);
    const createdUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
    });
    // if user created successfully ? create jwt
    if (createdUser) {
      const token = jwt.sign(
        // payload
        {
          user: {
            name: createdUser.name,
            phoneNumber: createdUser.phoneNumber,
            id: createdUser.id,
            email: createdUser.email,
            isAdmin: createdUser.isAdmin,
          },
        },
        // Our secrete code
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION }
      );
      return res.status(200).json({
        user: {
          name: createdUser.name,
          id: createdUser.id,
          phoneNumber: createdUser.phoneNumber,
          email: createdUser.email,
          isAdmin: createdUser.isAdmin,
          isVerified: createdUser.isVerified,
          avatar: createdUser.avatar,
        },
        token: token,
      });
    } else {
      return res.status(400).json({
        message: "server error Cant register new user name try again later",
      });
    }
  }
});

// @POST Register Hotels
// Route /api/auth/register/hotel
// Public Router

const registerHotel = asyncHandler(async (req, res) => {
  const hotelSignUpSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(10).required(),
    name: Joi.string().required(),
    address: Joi.string().required(),
    startPrice: Joi.string().required(),
    overview: Joi.string().required(),
    phoneNumber: Joi.string().required(),
  });
  const { error, value } = hotelSignUpSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { name, email, password, address, startPrice, overview, phoneNumber } =
    req.body;
  // check if Hotel already registered
  const HotelExist = await HotelModel.findOne({ email });
  if (HotelExist) {
    res.status(400).json({ message: "User already registered try new email" });
  }

  //  Hash password before creating user
  const hashedPassword = bcrypt.hashSync(password, 10);
  const createdHotel = await HotelModel.create({
    name,
    email,
    address,
    overview,
    startPrice,
    phoneNumber,
    password: hashedPassword,
  });

  if (createdHotel) {
    const token = jwt.sign(
      // payload
      {
        hotel: {
          name: createdHotel.name,
          id: createdHotel.id,
          email: createdHotel.email,
          isVerified: createdHotel.isVerified,
        },
      },
      // Our secrete code
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );
    res.status(200).json({
      hotel: {
        name: createdHotel.name,
        id: createdHotel.id,
        email: createdHotel.email,
        isVerified: createdHotel.isVerified,
      },
      token: token,
    });
  } else {
    res.status(400).json({
      message: "server error Cant register new user name try again later",
    });
  }
});

// @POST login Hotels
// Route /api/auth/login/hotel
// Public Router
const loginHotel = asyncHandler(async (req, res) => {
  const signInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(10).required(),
  });
  const { error, value } = signInSchema.validate(req.body, {
    abortEarly: false,
  });
  const { email, password } = req.body;
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // check if Hotel already registered
  const hotelExist = await HotelModel.findOne({ email });
  if (hotelExist) {
    const comperePassword = await bcrypt.compare(password, hotelExist.password);
    if (comperePassword) {
      const token = jwt.sign(
        // payload
        {
          hotel: {
            name: hotelExist.name,
            id: hotelExist.id,
            email: hotelExist.email,
            isVerified: hotelExist.isVerified,
          },
        },
        // Our secrete code
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION }
      );
      res.status(200).json({
        hotel: {
          name: hotelExist.name,
          id: hotelExist.id,
          email: hotelExist.email,
          isVerified: hotelExist.isVerified,
        },
        token: token,
      });
    } else {
      res.status(400).json({
        message: "Email or Password incorrect",
      });
    }
  } else {
    res.status(400).json({
      message: "Email or Password incorrect",
    });
  }
});

// @POST Login User
// Route /api/auth/login
// Public Router
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  // check if user already registered
  const userExist = await User.findOne({ email });
  if (userExist) {
    const comperePassword = await bcrypt.compare(password, userExist.password);
    console.log(comperePassword);
    if (comperePassword) {
      const token = jwt.sign(
        // payload
        {
          user: {
            name: userExist.name,
            id: userExist.id,
            email: userExist.email,
            isAdmin: userExist.isAdmin,
          },
        },
        // Our secrete code
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION }
      );
      res.status(200).json({
        user: {
          name: userExist.name,
          id: userExist.id,
          phoneNumber: userExist.phoneNumber,
          email: userExist.email,
          isAdmin: userExist.isAdmin,
          isVerified: userExist.isVerified,
          avatar: userExist.avatar,
        },
        token: token,
      });
    } else {
      res.status(401);
      throw new Error("Email or Password incorrect");
    }
  } else {
    res.status(401);
    throw new Error("Email or Password incorrect");
  }
});

module.exports = { registerUser, loginUser, registerHotel, loginHotel };
