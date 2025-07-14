const mongoose = require("mongoose")

const RatingModel = mongoose.Schema({
    rideId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"live-ride"
    },
    reviewerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ride"
    },
    revieweeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ride"
    },
    rating:{
        type:Number,
    },
    review:{
        type:String,
        require:true
    }
},{
    timestamps:true
})
module.exports=mongoose.model("rating",RatingModel)
