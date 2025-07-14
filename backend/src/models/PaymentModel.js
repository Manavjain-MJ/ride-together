const mongoose = require("mongoose")
const paymentSchema = mongoose.Schema({
    rideId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"live-ride"
    },
    riderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ride"
    },
    rideAmount:{
        type:Number
    },
    paymentMethod:{
        type:String
    },
    paymentStatus:{
        enum:["pending","completed","failed"],
        type:String
    }
},{
    timestamps:true
})
module.exports=mongoose.model("payment",paymentSchema)