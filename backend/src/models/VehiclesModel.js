const mongoose = require("mongoose");
const vehicleSchema = mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ride", 
      // required: true,
    },
    vehicleBrand: {
      type: String,
      required: true,
    },
    vehicleModel: {
      type: String,
      required: true,
    },
    vehicleYear: {
      type: Number,
      required: true,
      min: 1990, 
    },
    vehicleLicensePlate: {
      type: String,
      required: true,
      unique: true,
    },
    vehicleColor: {
      type: String,
      required: true,
    },
    // vehicleType: {
    //   type: String,
    //   enum: ["sedan", "suv", "hatchback", "electric"],
    //   // required: true,
    // },
    // fuelType: {
    //   type: String,
    //   enum: ["petrol", "diesel", "electric", "hybrid"],
    //   // required: true,
    // },
    airConditioning: {
      type: Boolean,
      default: false,
    },
    music: {
      type: Boolean,
      default: false,
    },
    // luggageCapacity: {
    //   type: String,
    //   enum: ["small", "medium", "large"],
    //   // required: true,
    // },
    vehicleImages: {
      type: [String],
      validate: [arrayLimit, "You can upload up to 5 images"],
    },
  },
  {
    timestamps: true,
  }
);

function arrayLimit(val) {
  return val.length <= 5;
}

module.exports = mongoose.model("vehicles", vehicleSchema);
