const mongoose = require("mongoose");
// Added this before env worked
require("dotenv").config();

const DB_CONNECTION = process.env.DB_CONNECTION_STRING;

// Connect to  DB
const connectDb = async () => {
  try {
    const connect = await mongoose.connect(DB_CONNECTION);

    console.log(`Server is running on port: ${connect.connection.host}`);
    console.log(`DataBase Connected: ${connect.connection.name}`);
  } catch (error) {
    console.log("DB Connection Failed");
  }
};

module.exports = connectDb;
