const liveRideModel = require("../models/LiveRideModel");
const rideRequestModel = require("../models/RideRequestModel")

const addLiveRide = async (req, res) => {
  try {
    const savedLiveRides = await liveRideModel.create(req.body);
    res.status(201).json({
      message: "Ride is Successfully Live",
      data: savedLiveRides,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
const getAllLiveRide = async (req, res) => {
  try {
    const allLiveRide = await liveRideModel.find().populate("driverId");
    res.status(200).json({
      message: "All Live Rides Fetched Successfully",
      data: allLiveRide,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getLiveRideById = async (req, res) => {
  try {
    const liveRideById = await liveRideModel
      .findById(req.params.id)
      .populate("driverId vehicleId");
    res.status(200).json({
      message: "Ride Fetched By Id Successfully",
      data: liveRideById,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const updateRideStatus = async (req, res) => {
  try {
    const { id, status, paymentStatus } = req.body;
    if (
      !["not-started", "in-progress", "completed", "cancelled"].includes(status)
    ) {
      return res.status(400).json({
        message:
          "Invalid status. Allowed statuses are: not-started, in-progress, completed, cancelled",
      });
    }
    if (
      paymentStatus &&
      !["pending", "paid", "failed"].includes(paymentStatus)
    ) {
      return res.status(400).json({
        message:
          "Invalid payment status. Allowed statuses are: pending, paid, failed",
      });
    }

    const updatedRide = await liveRideModel
      .findByIdAndUpdate(
        id,
        { status, paymentStatus: paymentStatus || "pending" },
        { new: true } // Return the updated document
      )
      .populate("driverId vehicleId");

    if (!updatedRide) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (status === "completed" && paymentStatus === "paid") {
      await rideRequestModel.deleteMany({ rideId: id });
      await liveRideModel.findByIdAndDelete(id); 
    }

    res.status(200).json({
      message: "Ride status updated successfully",
      data: updatedRide,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getRidesByDriverId = async (req, res) => {
  try {
    const driverId = req.params.driverId;

    // Fetch all rides where driverId matches
    const allLiveRides = await liveRideModel
      .find({ driverId: driverId })
      .populate("driverId vehicleId");

    // if (!allLiveRides.length) {
    //   return res.status(404).json({
    //     message: "No rides found for this driver.",
    //   });
    // }

    res.status(200).json({
      message: allLiveRides.length
        ? "All Live Rides for this driver fetched successfully."
        : "No rides found for this driver.",
      data: allLiveRides,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
const deleteRideByDriverId = async (req, res) => {
  try {
    const { driverId } = req.body;
    const ride = await liveRideModel.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({
        message: "Ride not found",
      });
    }
    if (ride.driverId.toString() !== driverId) {
      // assuming `req.driverId` contains the driver's ID
      return res.status(403).json({
        message: "You are not authorized to delete this ride",
      });
    }
    const deleteRide = await liveRideModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "ride deleted successfully",
      data: deleteRide,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getRideRequestsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    const rideRequests = await liveRideModel
      .find({ riderId: userId })
      .populate("rideId driverId");

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

const deleteRideRequestByUser = async (req, res) => {
  try {
    const { userId, rideId } = req.body;

    const deleted = await rideRequestModel.findOneAndDelete({
      riderId: userId,
      rideId: rideId,
    });

    if (!deleted) {
      return res.status(404).json({
        message: "No matching ride request found to delete.",
      });
    }

    res.status(200).json({
      message: "Ride request cancelled successfully.",
      data: deleted,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const searchLiveRides = async (req, res) => {
  try {
    const { startLocation, destination, date } = req.query;

    const query = {};

    if (startLocation)
      query.startLocation = { $regex: new RegExp(`^${startLocation}$`, "i") };
    if (destination)
      query.destination = { $regex: new RegExp(`^${destination}$`, "i") };

    if (date) {
      // Convert DD-MM-YYYY to YYYY-MM-DD
      const [day, month, year] = date.split("-");
      const formattedDate = `${year}-${month}-${day}`;

      const startOfDay = new Date(`${formattedDate}T00:00:00`);
      const endOfDay = new Date(`${formattedDate}T23:59:59.999`);

      query.departureTime = { $gte: startOfDay, $lte: endOfDay };
    }

    const matchingRides = await liveRideModel
      .find(query)
      .populate("driverId vehicleId");

    res.status(200).json({
      message: "Matching rides fetched successfully",
      data: matchingRides,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  addLiveRide,
  getAllLiveRide,
  getLiveRideById,
  updateRideStatus,
  getRidesByDriverId,
  deleteRideByDriverId,
  getRideRequestsByUserId,
  deleteRideRequestByUser,
  searchLiveRides,
};
