// WILL HANDLE ALL ERRORS FOR TRY CATCH BLOCK
const asyncHandler = require("express-async-handler");
const User = require("../model/UserModel");


// @GET All user
// Route /api/users
// Private Router 
// Access Admin

const getallUsers = asyncHandler(async (req, res) => {
    const allUsers = await User.find().select("-password");
    if (!allUsers) {
      return res.status(404).json({ message: "No Workers" });
    }
  
    res
      .status(201)
      .json({ success: "true", totalCount: allUsers.length, allUsers: allUsers });
  });

  
module.exports = { getallUsers };