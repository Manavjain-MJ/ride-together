const mongoose = require("mongoose")
const citySchema = mongoose.Schema({
    cityName:{
        type:String,
        require:true
    },
    stateId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"states"
    }
},{
    timestamps:true
})
module.exports=mongoose.model("cities",citySchema)