const notificationModel = require("../models/NotificationModel")

const addNotification = async(req,res)=>{
    try {
        const savedNotification = await notificationModel.create(req.body)
        res.status(201).json({
            message:"Notification Created Successfully",
            data:savedNotification
        })
    } catch (err) {
        res.status(500).json({
            message:err.message
        })
    }
}
const getAllNotification = async(req,res)=>{
    try {
        const getNotification = await notificationModel.find().populate("userId")
        res.status(200).json({
            message:"All Notifications Are Fetched Successfully",
            data:getNotification
        })
    } catch (err) {
        res.status(500).json({
            message:err.message
        })
    }
}
module.exports={
    addNotification,
    getAllNotification
}