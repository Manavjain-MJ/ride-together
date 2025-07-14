const routes = require("express").Router()
const vehiclesControllers = require("../controllers/VehiclesControllers")

// routes.post("/addvehicle",vehiclesControllers.addVehicle)
routes.get("/getvehicle",vehiclesControllers.getAllVehicles)
routes.post("/addfile",vehiclesControllers.addVehiclefile)
routes.put("/updatevehicle/:id",vehiclesControllers.updateVehicleDetails)
routes.delete("/deletevehicle/:id",vehiclesControllers.deleteVehicleDetails)

module.exports = routes