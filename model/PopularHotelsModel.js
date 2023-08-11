const mongoose = require("mongoose")


const PopularHotelSchema = mongoose.Schema({
    hotel : {
        type: mongoose.Schema.Types.ObjectId,
        ref :"hotel",
        require : true
    }
}, {
    timestamps: true,
  })



const PopularHotelModel = mongoose.model("PopularHotel", PopularHotelSchema);
module.exports = PopularHotelModel;
