const multer = require("multer");
const path = require("path");
const userProfileModel = require("../models/UserProfileModel");
const userModel = require("../models/RideModel");
const cloudinaryUtil = require("../utils/CloudinaryUtils");

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "./uploads");
//     },
//     filename: function (req, file, cb) {
//         const uniqueName = `${Date.now()}-${Math.round(
//             Math.random() * 1e9
//         )}${path.extname(file.originalname)}`;
//         cb(null, uniqueName);
//     },
// });

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 10 * 1024 * 1024 },
// }).single("profile");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("profile");

const updateUser = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    try {
      let imageUrl = null;

      if (req.file) {
        const uploadedImage = await cloudinaryUtil.uploadFileToCloudinary(
          req.file.buffer
        );
        imageUrl = uploadedImage.secure_url;
      }

      const existingProfile = await userProfileModel.findOne({
        userId: req.params.id,
      });

      if (!existingProfile) {
        return res.status(404).json({ message: "User not found", data: null });
      }

      // const updatedData = {
      //   ...existingProfile.toObject(),
      // {}  ...req.body,
      // };

      const updatedData = {};
      if (req.body.miniBio) updatedData.miniBio = req.body.miniBio;

      if (imageUrl) {
        updatedData.profilePicture = imageUrl;
      }

      const updatedUser = await userProfileModel
        .findOneAndUpdate(
          { userId: req.params.id },
          { $set: updatedData },
          { new: true }
        )
        .populate("userId");
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found", data: null });
      }
      res.status(200).json({
        message: "User updated successfully",
        data: updatedUser,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
};

const getUserProfile = async (req, res) => {
  try {
    const getProfile = await userProfileModel
      .findOne({ userId: req.params.id })
      .populate("userId");
    res.status(200).json({
      message: "User Profile Fetched Successfully",
      data: getProfile,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err,
    });
  }
};

const deleteUserAccount = async (req, res) => {
  const userId = req.params.id;

  try {
    // Delete from UserProfile collection
    const deletedProfile = await userProfileModel.findOneAndDelete({
      userId: userId,
    });

    // Delete from User collection (auth table)
    const deletedUser = await userModel.findByIdAndDelete(userId);

    if (!deletedProfile && !deletedUser) {
      return res.status(404).json({
        message: "User not found or already deleted.",
      });
    }

    return res.status(200).json({
      message: "User account deleted successfully.",
      profile: deletedProfile,
      user: deletedUser,
    });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({
      message: "Something went wrong while deleting the account.",
    });
  }
};

module.exports = {
  getUserProfile,
  updateUser,
  deleteUserAccount,
};
