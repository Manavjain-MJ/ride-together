const { json } = require('express')
const stateModel = require('../models/StateModel')
const addState = async(req,res)=>{
    try {
        const savedState = await stateModel.create(req.body)
        res.status(201).json({
            message:"State Added Successfully",
            data:savedState
        })
        
    } catch (err) {
        res.status(500),json({err})
        
    }
}

const getAllState = async(req,res)=>{
    try {
        const getState = await stateModel.find()
        res.status(200).json({
            message:"All States are fetched Successfully",
            data:getState
        })
        
    } catch (err) {
        res.status(500).json({err})
        
    }
}

module.exports={
    addState,   
    getAllState
}