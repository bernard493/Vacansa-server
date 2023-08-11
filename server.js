const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const connectDb = require("./config/dbConnection");
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const app = express();
const admin = require("firebase-admin");

const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

connectDb();

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profileRoute');
const userRoutes = require('./routes/userRoute');
const hotelsRoutes = require('./routes/hotelsRoute');
const roomRoutes = require('./routes/roomRoute');
const orderRoutes = require('./routes/orderRoute');
const reviewRoutes = require('./routes/reviewRoute');

app.listen(PORT, "172.20.10.6", () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.json({ message: "working" });
});

app.use("/api/auth/", authRoutes);
app.use("/api/profile/", profileRoutes);
app.use("/api/users/", userRoutes);
app.use("/api/hotels/", hotelsRoutes);
app.use("/api/room/", roomRoutes);
app.use("/api/order/", orderRoutes);
app.use("/api/review/", reviewRoutes);