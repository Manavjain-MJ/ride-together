const areaModel = require("../models/AreaModel")

const addArea = async(req,res)=>{
    try {
        const savedArea = await areaModel.create(req.body)
        res.status(201).json({
            message:"Area added successfully",
            data:savedArea
        })
    } catch (err) {
        res.status(500).json({err})
    }
}

const getAllArea = async(req,res)=>{
    try {
        const getArea = await areaModel.find().populate("cityId stateId userId")
        res.status(200).json({
            message:"All Areas Fetched Successfully",
            data:getArea
        })
    } catch (err) {
        res.status(500).json({err})        
    }
}

module.exports={
    addArea,
    getAllArea
}