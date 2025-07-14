const routes = require("express").Router()
const liveRideControllers = require("../controllers/LiveRideControllers")

routes.post("/addliveride",liveRideControllers.addLiveRide)
routes.get("/getliverides",liveRideControllers.getAllLiveRide)
routes.get("/getridebyid/:id",liveRideControllers.getLiveRideById)
routes.put("/updatestatus",liveRideControllers.updateRideStatus)    
routes.get("/driverrides/:driverId",liveRideControllers.getRidesByDriverId)    
routes.delete("/deletedriverride/:id",liveRideControllers.deleteRideByDriverId)
routes.get("/riderrides/:userId",liveRideControllers.getRideRequestsByUserId)
routes.delete("/deletedriderrequest/:id",liveRideControllers.deleteRideRequestByUser)
routes.get("/searchrides",liveRideControllers.searchLiveRides)

module.exports = routes