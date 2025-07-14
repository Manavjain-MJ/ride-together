const multer = require("multer");
const vehiclesModel = require("../models/VehiclesModel");
const cloudinaryUtil = require("../utils/CloudinaryUtils");

const storage = multer.memoryStorage();
// const storage = multer.diskStorage({
//   // destination:"./upload"
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
}).array("vehicleImages", 5);

const addVehiclefile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No images uploaded" });
      }

      const uploadedImages = await Promise.all(
        req.files.map(
          (file) => cloudinaryUtil.uploadFileToCloudinary(file.buffer) 
        )
      );

      const imageUrls = uploadedImages.map((upload) => upload.secure_url);

      console.log(req.body);
      req.body.vehicleImages = imageUrls;
      const savedVehicle = await vehiclesModel.create(req.body);

      res.status(201).json({
        message: "Vehicle added successfully",
        data: savedVehicle,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
};

// const addVehiclefile = async(req,res)=>{
//  upload(req,res,async(err)=>{
//   if(err){
//     res.status(500).json({
//       message:err
//     })
//   }else{
//     try {
//       const cloudinaryResponse =await cloudinaryUtil.uploadFileToCloudinary(req.file)
//       console.log(cloudinaryResponse)
//       console.log(req.body)
//       req.body.vehicleImages = cloudinaryResponse.secure_url
//       const savedVehicle = await vehiclesModel.create(req.body)

//       res.status(201).json({
//         message:"Vehicle added successfully",
//         data:savedVehicle
//       })

//     } catch (err) {
//       res.status(500).json({
//         message:err
//       })

//     }
//   }
//  })
// }

// const addVehicle = async (req, res) => {
//   try {
//     const savedVehicle = await vehiclesModel.create(req.body);
//     res.status(201).json({
//       message: "Vehicle Data Created Successfully",
//       data: savedVehicle,
//     });
//   } catch (err) {
//     res.json({message: err.message });
//   }
// };
const getAllVehicles = async (req, res) => {
  try {
    const getVehicles = await vehiclesModel.find().populate("driverId");
    res.status(200).json({
      message: "Vehicles Fetched Successfully",
      data: getVehicles,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
const updateVehicleDetails = async (req, res) => {
  try {
    const savedUpdatedVehicle = await vehiclesModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(201).json({
      message: "ID Updated Successfully",
      data: savedUpdatedVehicle,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const deleteVehicleDetails= async(req,res)=>{
  try {
    const deleteVehicle = await vehiclesModel.findByIdAndDelete(req.params.id)
    res.status(200).json({
      message:"Vehicle Deleted Successfully",
      data:deleteVehicle
    })
    
  } catch (err) {
    
  }
}
module.exports = {
  // addVehicle,
  getAllVehicles,
  addVehiclefile,
  updateVehicleDetails,
  deleteVehicleDetails
};
