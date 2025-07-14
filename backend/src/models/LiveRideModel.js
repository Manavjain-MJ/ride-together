const mongoose = require("mongoose");
const liveRideSchema = mongoose.Schema(
  {
    // riderId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "ride",
    //   required: true,
    // },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vehicles",
      required: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ride",
      required: true,
    },
    startLocation: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    departureTime: {
      type: Date,
      required: true,
    },
    arrivalTime: {
      type: String,
    },
    seatsAvailable: {
      type: Number,
      required: true,
      min: 0,
    },
    pricePerSeat: {
      type: Number,
      required: true,
      min: 1,
    },
    // rideType: {
    //   type: String,
    //   enum: ["one-time", "recurring"],
    //   default: "one-time",
    // },
    // rideDescription: {
    //   type: String,
    // },
    // viaLocations: {
    //   type: [String],
    // },
    // preferredRoute: {
    //   type: String,
    //   enum: ["fastest", "shortest", "highway"],
    //   default: "fastest",
    // },
    // allowVerifiedUsers: {
    //   type: Boolean,
    //   default: false,
    // },
    // autoAccept: {
    //   type: Boolean,
    //   default: false,
    // },
    // contactPreference: {
    //   type: String,
    //   enum: ["in-app", "phone", "any"],
    //   default: "in-app",
    // },
    status: {
      type: String,
      enum: ["not-started", "in-progress", "completed", "cancelled"],
      default: "not-started",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending", // default is 'pending' until payment is done
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("live-ride", liveRideSchema);
