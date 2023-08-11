// WILL HANDLE ALL ERRORS FOR TRY CATCH BLOCK
const asyncHandler = require("express-async-handler");
const User = require("../model/UserModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const HotelModel = require("../model/HotelModel");
var fs = require("fs");
var path = require("path");
const admin = require("firebase-admin");

// @GET UserProfile
// Route /api/profile
// Private Router
// Access User
const getUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const userProfile = await User.findById(id).select("-password");
  if (!userProfile) {
    return res.status(404).json({ message: `Error occurred  try again later` });
  }
  res.status(200).json({ user: userProfile, success: "true" });
});
// @GET HotelProfile
// Route /api/profile
// Private Router
// Access Hotel
const getHotelProfile = asyncHandler(async (req, res) => {
  const { id } = req.hotel;

  const hotelProfile = await HotelModel.findById(id).select("-password");
  if (!hotelProfile) {
    return res.status(404).json({ message: `Error occurred  try again later` });
  }
  res.status(200).json({ hotel: hotelProfile, success: "true" });
});

// @PUT  HotelProfile
// Route /api/profile
// Private Router
// Access Hotel

const updateUserProfile = asyncHandler(async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: `No user found with id ${id}` });
    }

    // check if user is authorized if trying to perform this action
    if (id === user.id.toString()) {
      const updateUser = await User.findByIdAndUpdate(id, req.body);
      if (!updateUser) {
        return res
          .status(404)
          .json({ message: `Can no update details now try again later` });
      }
      const updatedUser = await User.findById(id).select("-password");
      if (updatedUser) {
        const token = jwt.sign(
          // payload
          {
            user: {
              name: updatedUser.name,
              id: updatedUser.id,
              email: updatedUser.email,
              isAdmin: updatedUser.isAdmin,
            },
          },
          // Our secrete code
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "7d" }
        );
        res.status(200).json({
          token,
          updatedUser: {
            name: updatedUser.name,
            id: updatedUser.id,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            avatar: updatedUser.avatar,
            isVerified: updatedUser.isVerified,
            phoneNumber: updatedUser.phoneNumber,
          },
          success: "true",
        });
      }
    } else {
      throw new Error("Not authorized to perform this action");
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: error.message });
  }
});

// @PUT  HotelProfile
// Route /api/profile
// Private Router
// Access Hotel

const updateHotelProfile = asyncHandler(async (req, res) => {
  try {
    const { id } = req.hotel;
    const hotel = await HotelModel.findById(id);
    if (!hotel) {
      return res.status(404).json({ message: `No hotel found with id ${id}` });
    }
    console.log("req.hotel");
    //  console.log("req.hotel" ,id)
    // check if user is authorized if trying to perform this action
    if (id === hotel.id.toString()) {
      const updateHotel = await HotelModel.findByIdAndUpdate(id, req.body);
      if (!updateHotel) {
        return res
          .status(404)
          .json({ message: `Can no update details now try again later` });
      }
      const updatedHotel = await HotelModel.findById(id).select("-password");
      if (updatedHotel) {
        const token = jwt.sign(
          // payload
          {
            hotel: {
              name: updatedHotel.name,
              id: updatedHotel.id,
              email: updatedHotel.email,
              isAdmin: updatedHotel.isAdmin,
              // avatar: userExist.avatar,
            },
          },
          // Our secrete code
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "7d" }
        );
        res
          .status(200)
          .json({ hotel: updatedHotel, token: token, success: "true" });
      }
    } else {
      throw new Error("Not authorized to perform this action");
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: error.message });
  }
});




// @POST  UpdateUserAvatar
// Route /api/profile/avatar
// Private Router
// Access user

const updateUserAvatar = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const { filename, originalname, mimetype, size } = req.file;

  try {
    const bucket = admin.storage().bucket("gs://vacanza-3729c.appspot.com/");
    const storagePath = `avatar/${filename}`;

    bucket
      .upload(req.file.path, {
        destination: storagePath,
        metadata: {
          contentType: mimetype,
          metadata: {
            originalname: originalname,
            size: size,
            userId: id,
          },
        },
      })
      .then(async (response) => {
        const user = await User.findById(id);
        // get public URL of upload img
        const file = bucket.file(storagePath);
        file
          .getSignedUrl({
            action: "read",
            expires: "2050-01-01",
          })
          .then(async (urls) => {
            const userAvatarURL = urls[0];

            if (user) {
              if (id === user._id.toString()) {
                const updatedUserAvatar = await User.findByIdAndUpdate(
                  user._id,
                  {
                    avatar: userAvatarURL,
                  }
                );
                if (!updatedUserAvatar) {
                  res.status(400).json({
                    success: false,
                    message: "Error while uploading profile image",
                  });
                }
                const updatedUser = await User.findById(id);
                if (updatedUser) {
                  const token = jwt.sign(
                    // payload
                    {
                      user: {
                        name: updatedUser.name,
                        id: updatedUser.id,
                        email: updatedUser.email,
                        isAdmin: updatedUser.isAdmin,
                        // avatar: userExist.avatar,
                      },
                    },
                    // Our secrete code
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: "7d" }
                  );
                  res.status(200).json({
                    token,
                    success: "true",
                    updatedUser: {
                      name: updatedUser.name,
                      id: updatedUser.id,
                      email: updatedUser.email,
                      isAdmin: updatedUser.isAdmin,
                      avatar: updatedUser.avatar,
                      isVerified: updatedUser.isVerified,
                      phoneNumber: updatedUser.phoneNumber,
                    },
                  });
                }
              }
            } else {
              res.status(400).json({
                success: false,
                message: "No  user found",
              });
            }
          })
          .catch((error) => {
            console.error("Error uploading image to firebase", error);
            res.status(500).json({
              success: false,
              message: "Image uploading image to firebase",
            });
          });
      });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "server error, try after some time" });
    console.log("Error while uploading profile image", error.message);
  }
});

module.exports = {
  getUserProfile,
  getHotelProfile,
  updateUserProfile,
  updateHotelProfile,
  updateUserAvatar,
  
};
