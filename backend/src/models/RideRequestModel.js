const mongoose = require("mongoose");
const RideRequestSchema = mongoose.Schema(
  {
    riderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ride",
    },
    rideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "live-ride",
      required: true,
    },
    pickupLocation: {
      type: String,
    },
    dropoffLocation: {
      type: String,
    },
    seatCount: {
      type: Number,
      default: 1,
    },
    ridestatus: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    preferences: {
      quietRide: { type: Boolean, default: false },
      nonSmoking: { type: Boolean, default: false },
      petFriendly: { type: Boolean, default: false },
      moreSpace: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("ride-request", RideRequestSchema);
