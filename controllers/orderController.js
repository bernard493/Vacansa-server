// WILL HANDLE ALL ERRORS FOR TRY CATCH BLOCK
const asyncHandler = require("express-async-handler");
const User = require("../model/UserModel");
const OrderModel = require("../model/OrderModel");
const Joi = require("joi");

// @POST Create order
// Route /api/order/
// Private Router
// Access user
const createOrder = asyncHandler(async (req, res) => {
  const OrderSchema = Joi.object({
    room_id: Joi.string().required(),
    hotel_id: Joi.string().required(),
    checkingInDate: Joi.string().required(),
    checkingOutDate: Joi.string().required(),
    bookingName: Joi.string().required(),
    bookingEmail: Joi.string().required(),
    bookingNumber: Joi.number().required(),
    totalAmountPaid: Joi.number().required(),
    paymentMethod: Joi.string().required(),
  });
  const { error, value } = OrderSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  } else {
    try {
      // check if it user creating order
      const { id } = req.user;
      const user = await User.findById(id);
      if (user) {
        const { room_id, hotel_id } = req.body;

        const createdOrder = await OrderModel.create({
          user: id,
          room: room_id,
          hotel: hotel_id,
          ...req.body,
        });
        if (!createdOrder) {
          res.status(400);
          throw new Error("Can not create new Order now try again later");
        }

        res.status(200).json({ success: "true", order: createdOrder });
      } else {
        throw new Error("Not authorized to perform this action");
      }
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ message: error.message });
    }
  }
});
// @GET Create order
// Route /api/order/:id
// Private Router
// Access user hotel Admin
const getOrderById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const schema = Joi.object({
      id: Joi.string().required(),
    });
    const { error, value } = schema.validate({ id }, { abortEarly: false });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const order = await OrderModel.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ success: "true", order: order });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).json({ message: error.message });
    } else if (error.name === "CastError") {
      res.status(400).json({ message: "Invalid order ID" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

// @GET Create order
// Route /api/order/all
// Private Router
// Access  hotel user
const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const { id } = req.user || req.hotel;
    let allOrders;
    if (req.hotel) {
      allOrders = await OrderModel.find({ hotel: id }).populate({
        path: "room",
        select: "image roomTitle bed guests",
      });
    }
    if (req.user) {
      allOrders = await OrderModel.find({ user: id })
        .populate({
          path: "room",
          select: "image roomTitle bed guests",
        })
        .sort({ _id: -1 });
    }
    if (!allOrders) {
      res.status(404);
      throw new Error("No orders found");
    }
    res.status(200).json({
      success: true,
      totalCount: allOrders.length,
      orders: allOrders,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).json({ message: error.message });
    } else if (error.name === "CastError") {
      res.status(400).json({ message: "Invalid order ID" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

// @PUT Create order
// Route /api/by/id
// Private Router
// Access  hotel user
const UpdateOrderById = asyncHandler(async (req, res) => {
  try {
    const orderId = req.params.id;
    const hotel = req.hotel;
    const user = req.user;

    // Suggestion 1: Validate the request body
    const OrderSchema = Joi.object({
      status: Joi.string().required(),
    });
    const { error, value } = OrderSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // check its user and can only cancel order
    if (user || hotel) {
      const updatedOrder = await OrderModel.findByIdAndUpdate(orderId, value, {
        new: true,
      });
      if (!updatedOrder) {
        return res
          .status(404)
          .json({ message: `Can not update order now try again later` });
      }
      res.status(200).json({ order: updatedOrder, success: "true" });
    } else {
      // Suggestion 2: Use a consistent HTTP status code
      res
        .status(403)
        .json({ message: "Not authorized to perform this action" });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: error.message });
  }
});
module.exports = {
  createOrder, // Assuming this is a typo and should be UpdateOrderById
  getOrderById,
  getAllOrders,
  UpdateOrderById,
};
