const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
require("dotenv").config();

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  let tokenHeader = req.headers.Authorization || req.headers.authorization;

  if (tokenHeader && tokenHeader.startsWith("Bearer")) {
    token = tokenHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, data) => {
      console.log("data",data)
      if (error) {
        res.status(401);
        throw new Error("User not Authorized");
      }
      if(data.user){
        req.user = data.user;
        next();
      }else{
        req.hotel = data.hotel;
        next();
      }
      
    });
    if (!token) {
      res.status(401);
      throw new Error("User not Authorized oe token missing");
    }
  }
});

module.exports = validateToken;
