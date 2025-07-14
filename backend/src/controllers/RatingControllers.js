const RatingModel = require("../models/RatingModel")

const addRatings = async(req,res)=>{
    try {
        const saveRating = await RatingModel.create(req.body)
        res.status(201).json({
            message:"Ratings Added Successfully",
            data:saveRating
        })
        
    } catch (err) {
        res.status(500).json({
            message:err.message
        })        
    }
}
const getAllRatings = async(req,res)=>{
    try {
        const getRatings = await RatingModel.find().populate("rideId reviewerId revieweeId")
        res.status(200).json({
            message:"All Ratings Fetched Successfully",
            data:getRatings
        })
    } catch (err) {
        res.status(500).json({
            message:err.message
        })        
    }
}
module.exports = {
    addRatings,
    getAllRatings
}