const cityModel = require("../models/CityModel")

const addCity = async(req,res)=>{
    try {
        const savedCity = await cityModel.create(req.body)
        res.status(201).json({
            message:"City Added Successfully",
            data:savedCity
        })
    } catch (err) {
        res.status(500).json({err})
    }
}

const getAllCities=async(req,res)=>{
    try {
        const getCities = await cityModel.find()
        res.status(200).json({
            message:"All cities Fetched Successfully",
            data:getCities
        })
    } catch (err) {
        res.status(500).json({err})
        
    }
}

module.exports={
    addCity,
    getAllCities
}