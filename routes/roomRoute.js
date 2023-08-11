const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateToken");
const {
  createRooms,
  getRoomsById,
  getAllRoomsOfHotel,
  getAllRoomsOfHotelSelected,
  UpdateRoomsById,
  deleteRoomsById,
} = require("../controllers/roomsController");



// Create a  rooms
//  Hotel
router.post("/",validateToken, createRooms);

// Get id rooms
//  User Admin Hotel
router.get("/by/:id",validateToken, getRoomsById);

// Get all rooms Of Hotel
//   Hotel
// router.get("/allroomsavailable",validateToken, getAllRoomsOfHotel);


// Get all rooms Of  Hotel selected
//   Hotel
router.get("/availablerooms/:hotel_id",validateToken, getAllRoomsOfHotelSelected);

// UPdate  rooms by id
//  Hotel
router.put("/:id",validateToken, UpdateRoomsById);

// Delate  rooms by id
//  Hotel
router.delete("/:id",validateToken, deleteRoomsById);

module.exports = router;
