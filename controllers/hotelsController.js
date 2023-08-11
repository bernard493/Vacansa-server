// WILL HANDLE ALL ERRORS FOR TRY CATCH BLOCK
const asyncHandler = require("express-async-handler");
const HotelModel = require("../model/HotelModel");
const PopularHotelModel = require("../model/PopularHotelsModel");
const RecommendedHotelModel = require("../model/RecommendedHotelModel");
// @GET All Hotels
// Route /api/hotels
// Private Router
// Access Admin

const getallHotels = asyncHandler(async (req, res) => {
  const hotels = await HotelModel.find().select("-password");
  if (!hotels) {
    return res.status(404).json({ message: "No Hotels" });
  }

  res
    .status(201)
    .json({ success: "true", totalCount: hotels.length, hotels: hotels });
});




// @GET  Hotel By Id
// Route /api/hotels/id
// Private Router
// Access Admin and User

const getHotelById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await HotelModel.findById(id).select("-password");
    if (!hotel) {
      return res.status(404).json({ message: `No worker found with id ${id}` });
    }
    res.status(200).json({ hotel: hotel, success: "true" });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: error.message });
  }
});
// @POST Popular  Hotel
// Route /api/hotels/popularHotels
// Private Router
// Access Admin and User

const createPopularHotels = asyncHandler(async (req, res) => {
  try {
    const { hotel_id } = req.body;
    if (!hotel_id) {
      res.status(400);
      throw new Error("Please provide hotel id");
    }
    const popularHotel = await PopularHotelModel.create({ hotel: hotel_id });
    if (!popularHotel) {
      return res.status(404).json({ message: `Server error try again later ` });
    }
    res.status(200).json({ popularHotels: popularHotel, message: `created ` });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: error.message });
  }
});
// @POST Popular  Hotel
// Route /api/hotels/RecommendedHotel
// Private Router
// Access Admin and User

const createRecommendedHotel = asyncHandler(async (req, res) => {
  try {
    const { hotel_id } = req.body;
    if (!hotel_id) {
      return res.status(400).json({ message: 'Please provide hotel id' });
    }
    const recommendedHotel = await RecommendedHotelModel.create({
      hotel: hotel_id,
    });
    if (!recommendedHotel) {
      return res.status(404).json({ message: `Server error try again later ` });
    }
    res.status(200).json({ recommendedHotels: recommendedHotel, message: `created ` });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: error.message });
  }
});

// @GET Popular  Hotel
// Route /api/hotels/popularHotels
// Private Router
// Access Admin and User

const getAllPopularHotels = asyncHandler(async (req, res) => {
  try {
    const hotels = await PopularHotelModel.find().populate({
      path: "hotel",
      select: "name address startPrice image",
    });
    if (!hotels || hotels.length === 0) {
      return res.status(404).json({ message: `No popular hotels found` });
    }
    res.status(200).json({
      totalCount: hotels.length,
      popularHotels: hotels,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: error.message });
  }
});
// @GET recommendedHotels  Hotel
// Route /api/hotels/recommendedHotels
// Private Router
// Access Admin and User

const getRecommendedHotels = asyncHandler(async (req, res) => {
  try {
    const hotels = await RecommendedHotelModel.find().populate({
      path: "hotel",
      select: "name address startPrice image",
    });
    if (!hotels || hotels.length === 0) {
      return res.status(404).json({ message: `no hotels found` });
    }
    res
      .status(200)
      .json({
        totalCount: hotels.length,
        success: true,
        recommendedHotels: hotels,
      });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: error.message });
  }
});
module.exports = {
  getallHotels,
  getHotelById,
  getAllPopularHotels,
  getRecommendedHotels,
  createPopularHotels,
  createRecommendedHotel,
};
