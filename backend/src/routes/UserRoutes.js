const routes = require("express").Router()
const UserControllers = require("../controllers/UserControllers")
routes.get("/users",UserControllers.getUser)
routes.post("/user",UserControllers.addUser1)
routes.post("/user/signup",UserControllers.signUp)
routes.post("/user/login",UserControllers.loginUser)
routes.get("/user/:id",UserControllers.getUserId)
routes.delete("/users/:id",UserControllers.deleteUser)

module.exports = routes