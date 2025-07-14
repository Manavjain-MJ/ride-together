const mongoose = require("mongoose");
const userProfileSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ride",
    required: true,
    unique: true,
  },
  profilePicture: {
    type: String,
  },
  miniBio: {
    type: String,
    default: "",
  },
  travelPreferences: {
    type: String,
  },
  govtIdVerified: {
    type: Boolean,
    default: false,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  phoneVerified: {
    type: Boolean,
    default: false,
  },
  vehicles: [
    {
      model: String,
      licensePlate: String,
    },
  ],
  rating: {
    type: Number,
    default: 0,
  },
});
module.exports = mongoose.model("profile", userProfileSchema);
