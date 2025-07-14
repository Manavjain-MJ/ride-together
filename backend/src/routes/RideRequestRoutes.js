const routes = require("express").Router()
const rideRequestControllers = require("../controllers/RideRequestControllers")

routes.post("/addriderequest",rideRequestControllers.addRideRequest)
routes.get("/getriderequest",rideRequestControllers.getAllRideRequest)
routes.get("/getriderequestid/:rideId",rideRequestControllers.getRideRequestsByRideId)
routes.get("/getriderequestbyid/:userId",rideRequestControllers.getRideRequestsByUserId)
routes.put("/updatedstatus/:requestId",rideRequestControllers.updateRideRequestStatus)
routes.delete("/deleteriderequest/:requestId",rideRequestControllers.deleteRideRequest)

module.exports= routes