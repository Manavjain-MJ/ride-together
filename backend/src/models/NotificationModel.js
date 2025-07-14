const mongoose = require("mongoose")
const notificationSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ride"
    },
    notificationMessage:{
        type:String,
        require:true
    },
    notificationStatus:{
        type:String
    }
})
module.exports=mongoose.model("notification",notificationSchema)