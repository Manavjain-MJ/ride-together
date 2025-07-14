const rideRequestModel = require("../models/RideRequestModel");
const RideModel = require("../models/LiveRideModel")

// const addRideRequest = async (req, res) => {
//   try {
//     const savedRideRequest = await rideRequestModel.create(req.body);
//     res.status(201).json({
//       message: "Ride Request Added Successfully",
//       data: savedRideRequest,
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: err.message,
//     });
//   }
// };

const getAllRideRequest = async (req, res) => {
  try {
    const getRideRequest = await rideRequestModel
      .find()
      .populate("riderId rideId");
    res.status(201).json({
      message: "All Ride Requests Fetched Succesfully",
      data: getRideRequest,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getRideRequestsByRideId = async (req, res) => {
  try {
    const { rideId } = req.params;
    const getRideRequest = await rideRequestModel
      .find({ rideId })
      .populate("riderId rideId");
    if (!getRideRequest || getRideRequest.length === 0) {
      return res.status(404).json({
        message: "No ride requests found for this ride.",
      });
    }

    res.status(201).json({
      message: "Ride Requests Fetched Successfully",
      data: getRideRequest,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const addRideRequest = async (req, res) => {
  const { riderId, rideId, pickupLocation, dropoffLocation, preferences } =
    req.body;

  if (!riderId || !rideId || !pickupLocation || !dropoffLocation) {
    return res.status(400).json({ message: "All fields are required!" });
  }
  try {
    // Check for existing request
    const existingRequest = await rideRequestModel.findOne({ riderId, rideId });
    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "Request already sent for this ride." });
    }
    const rideRequestData = {
      riderId,
      rideId,
      pickupLocation,
      dropoffLocation,
      preferences: preferences || "No preferences specified",
      ridestatus: "pending",
    };

    const savedRideRequest = await rideRequestModel.create(req.body);
    res.status(201).json({
      message: "Ride Request Added Successfully",
      data: savedRideRequest,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateRideRequestStatus = async (req, res) => {
  const { requestId } = req.params; // Get ride request ID from URL
  const { ridestatus } = req.body; // Accept or Reject status

  if (!ridestatus || !["accepted", "rejected"].includes(ridestatus)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    // Find the ride request by ID
    const rideRequest = await rideRequestModel
      .findById(requestId)
      .populate("rideId");

    if (!rideRequest) {
      return res.status(404).json({ message: "Ride request not found" });
    }

    // Only deduct seats if status is changing to accepted
    if (ridestatus === "accepted") {
      const ride = await RideModel.findById(rideRequest.rideId);
      if (!ride) {
        return res.status(404).json({ message: "Associated ride not found" });
      }

      if (ride.seatsAvailable < rideRequest.seatCount) {
        return res.status(400).json({ message: "Not enough seats available" });
      }

      ride.seatsAvailable -= rideRequest.seatCount;

      // Optionally disable ride if no seats left
      // if (ride.seatsAvailable === 0) {
      //   ride.status = "full"; 
      // }

      await ride.save();
    }

    if (!rideRequest) {
      return res.status(404).json({ message: "Ride request not found" });
    }

    // Update the status of the ride request
    rideRequest.ridestatus = ridestatus;
    await rideRequest.save();

    res.status(200).json({
      message: `Ride request ${ridestatus} successfully`,
      rideRequest,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getRideRequestsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch all ride requests where userId is the rider
    const rideRequests = await rideRequestModel
      .find({ riderId: userId })
      .populate("rideId");

    if (!rideRequests.length) {
      return res.status(404).json({
        message: "No ride requests found for this user.",
      });
    }

    res.status(200).json({
      message: "Ride requests fetched successfully.",
      data: rideRequests,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const deleteRideRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const deletedRequest = await rideRequestModel.findByIdAndDelete(requestId);

    if (!deletedRequest) {
      return res.status(404).json({ message: "Ride request not found." });
    }

    res.status(200).json({
      message: "Ride request deleted successfully.",
      data: deletedRequest,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addRideRequest,
  getAllRideRequest,
  getRideRequestsByRideId,
  updateRideRequestStatus,
  getRideRequestsByUserId,
  deleteRideRequest,
};
