const paymentModel = require("../models/PaymentModel")

const addPayment = async(req,res)=>{
    try {
        const savedPayment = await paymentModel.create(req.body)
        res.status(201).json({
            message:"Payment Added Successfully",
            data:savedPayment
        })
    } catch (err) {
        res.status(500).json({
            message:err.message
        })        
    }
} 
const getAllPayment = async(req,res)=>{

    try {
        const getpayment = await paymentModel.find().populate("rideId riderId")
        res.status(200).json({
            message:"All Payment Fetched Successfully",
            data:getpayment
        })
    } catch (err) {
        res.status(500).json({
            message:err.message 
        })
    }
}
module.exports={
    addPayment,
    getAllPayment
}