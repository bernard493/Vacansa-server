// WILL HANDLE ALL ERRORS FOR TRY CATCH BLOCK
const asyncHandler = require("express-async-handler");
const RoomModel = require("../model/RoomModel");
const HotelModel = require("../model/HotelModel");
const Joi = require("joi");

// @POST Create room
// Route /api/room/hotel
// Private Router
// Access Hotel
const createRooms = asyncHandler(async (req, res) => {
  const roomSchema = Joi.object({
    roomTitle: Joi.string().required(),
    roomsAvailable: Joi.string().required(),
    bed: Joi.string().required(),
    guests: Joi.string().required(),
    wifi: Joi.boolean().required(),
    squareMeter: Joi.string().required(),
    price: Joi.number().required(),
    roomDescription: Joi.string().required(),
  });
  const { error, value } = roomSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  } else {
    try {
      const { id } = req.hotel;
      const hotel = await HotelModel.findById(id);
      if (hotel) {
        const {
          roomTitle,
          bed,
          guests,
          wifi,
          squareMeter,
          price,
          roomsAvailable,
        } = req.body;
        if (
          !roomTitle ||
          !bed ||
          !guests ||
          !wifi ||
          !squareMeter ||
          !price ||
          !roomsAvailable
        ) {
          res.status(400);
          throw new Error("Please provide all required fields");
        }

        const createdRoom = await RoomModel.create({
          hotel_id: id,
          ...req.body,
        });
        if (!createdRoom) {
          res.status(400);
          throw new Error("Can not create new room now try again later");
        }

        res.status(200).json({ room: createdRoom, success: "true" });
      } else {
        throw new Error("Not authorized to perform this action");
      }
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ message: error.message });
    }
  }
});

// @GET All  Room  created by  Hotel
// Route /api/room/allroomsavailable
// Private Router
// Access Hotel

const getAllRoomsOfHotel = asyncHandler(async (req, res) => {
  try {
    const { id } = req.hotel;
    const allRooms = await RoomModel.find({ hotel_id: id });
    if (!allRooms) {
      res.status(400);
      throw new Error("Can not create new room now try again later");
    }
    res.status(200).json({
      success: true,
      totalCount: allRooms.length,
      rooms: allRooms,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: error.message });
  }
});

// @PUT Update  Room  Of Hotel
// Route /api/room/id
// Private Router
// Access hotel
const UpdateRoomsById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const hotelId = req.hotel.id;
    const room = await RoomModel.findById(id);
    if (room) {
      // check if user is authorized if trying to perform this action
      if (hotelId === room.hotel_id.toString()) {
        const updateRoom = await RoomModel.findByIdAndUpdate(id, req.body);
        if (!updateRoom) {
          return res.status(404).json({
            message: `can  not update room with id ${id} try again later`,
          });
        }
        const updatedRoom = await RoomModel.findById(id);
        res.status(200).json({
          success: true,
          room: updatedRoom,
        });
      } else {
        throw new Error("Not authorized to perform this action");
      }
    } else {
      throw new Error("No room found with id ");
    }
    res.json({ message: "UpdateRoomsById" });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: error.message });
  }
});

// @DELATE    Room  Of Hotel
// Route /api/room/id
// Private Router
// Access hotel
const deleteRoomsById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const hotelId = req.hotel.id;
    const room = await RoomModel.findById(id);
    if (room) {
      // check if user is authorized if trying to perform this action
      if (hotelId === room.hotel_id.toString()) {
        const delateRoom = await RoomModel.findByIdAndDelete(id);
        res.status(200).json({ message: " Deleted Successfully " });
      } else {
        throw new Error("Not authorized to perform this action");
      }
    } else {
      throw new Error("No room found with id ");
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: error.message });
  }
});

// @GET  Room BY id
// Route /api/room/by/id
// Private Router
// Access  User Admin Hotel
const getRoomsById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const room = await RoomModel.findById(id);
  if (!room) {
    res.status(400);
    throw new Error(`Cant find room with ${id} `);
  }

  res.status(200).json({ success: "true", room });
});

// @GET  Hotel selected BY id
// Route /api/room/availablerooms/hotel_id
// Private Router
// Access  User
const getAllRoomsOfHotelSelected = asyncHandler(async (req, res) => {
  const { hotel_id } = req.params;
  const rooms = await RoomModel.find({ hotel_id: hotel_id });
  if (!rooms) {
    res.status(400);
    throw new Error(`Cant find room with ${id} `);
  }

  res.status(200).json({ success: true, totalCount: rooms.length, rooms });
});

module.exports = {
  createRooms,
  getRoomsById,
  getAllRoomsOfHotel,
  getAllRoomsOfHotelSelected,
  UpdateRoomsById,
  deleteRoomsById,
};
