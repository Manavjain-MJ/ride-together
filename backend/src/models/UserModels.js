const mongoose = require("mongoose")
const userSchema = mongoose.Schema({
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    age:{
        type:Number 
    },
    status:{
        type:Boolean,
        default:true
    },
    roleId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"roles"
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String
    }

})
module.exports=mongoose.model("user",userSchema)