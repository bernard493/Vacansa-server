const express = require("express");
const router = express.Router()
const validateToken = require("../middleware/validateToken");
const {
  createOrder,
  getOrderById,
  getAllOrders,
  UpdateOrderById,
} = require("../controllers/orderController");

// Create an order
//  User
router.post("/", validateToken, createOrder);

// Get order by ID
//  User, Admin, Hotel
router.get("/by/:id", validateToken, getOrderById);

// Get all orders
//   Hotel user
router.get("/all", validateToken, getAllOrders);

// Update order by ID
//  Hotel user
router.put("/by/:id", validateToken, UpdateOrderById);

module.exports = router;