const mongoose = require("mongoose")
const stateSchema = mongoose.Schema({
    stateName:{
        type:String,
        require:true,
        unique:true
    }

},{timestamps:true})
module.exports=mongoose.model("states",stateSchema)