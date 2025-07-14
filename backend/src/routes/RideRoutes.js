const routes = require("express").Router()
const RideControllers = require("../controllers/RideControllers")
routes.get("/rides",RideControllers.getUser)
routes.post("/ride",RideControllers.addUser1)
routes.post("/ride/signup",RideControllers.signUp)
routes.post("/ride/login",RideControllers.loginUser)
routes.get("/ride/:id",RideControllers.getUserId)
routes.delete("/rides/:id",RideControllers.deleteUser)
routes.post("/ride/forgetpassword",RideControllers.forgetPassword)
routes.post("/ride/resetpassword",RideControllers.resetpassword)

module.exports = routes 