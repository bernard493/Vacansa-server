const express = require("express")
const router = express.Router()
const validateToken = require("../middleware/validateToken");
const {getallUsers} = require("../controllers/userController");


// Get all hotels
router.get("/" ,getallUsers)





module.exports = router;