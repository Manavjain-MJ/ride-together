const mongoose = require("mongoose")
const rideSchema = mongoose.Schema({
    userName:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String
    },
    mobileNumber:{
        type:Number 
    },
    userType:{
        type:String,
        require:true,
        enum:["rider","driver"]
    },
    // confirmPassword:{
    //     type:String
    // },
    vehicleModel:{
        type:String,
    }, 
    licensePlate:{
        type:String
    },
    roleId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"roles"
    }

})
module.exports=mongoose.model("ride",rideSchema)