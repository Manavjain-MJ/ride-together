const routes = require("express").Router()

const StateControllers = require("../controllers/StateControllers")

routes.post("/addstate",StateControllers.addState)
routes.get("/getstate",StateControllers.getAllState)


module.exports = routes