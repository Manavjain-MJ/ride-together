const mongoose = require("mongoose");
const areaSchema = mongoose.Schema({
  areaName: {
    type: String,
    require: true,
  },
  cityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "cities",
  },
  stateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "states",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  pinCode:{
    type:Number
  }
},{
    timestamps:true
});
module.exports=mongoose.model("areas",areaSchema)
