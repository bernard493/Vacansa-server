const mongoose = require("mongoose");

const userAvatarScheme = mongoose.Schema({
  type: mongoose.Schema.Types.ObjectId,
  ref: "user",
  required: true,
  name: String,
  img: {
    data: Buffer,
    contentType: "image/png",
  },
});

const AvatarModel = mongoose.model("avatar", userAvatarScheme);

module.exports = AvatarModel;
