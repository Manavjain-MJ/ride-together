const routes = require("express").Router()

const areaControllers = require("../controllers/AreaControllers")

routes.post("/addarea",areaControllers.addArea)
routes.get("/getarea",areaControllers.getAllArea)

module.exports = routes