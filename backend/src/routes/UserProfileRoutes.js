const routes = require("express").Router()
const userProfileControllers = require("../controllers/UserProfileControllers")
const { route } = require("./RoleRoute")

routes.get("/userprofile/:id",userProfileControllers.getUserProfile)
routes.put("/updateprofile/:id",userProfileControllers.updateUser)
routes.delete("/closemyaccount/:id",userProfileControllers.deleteUserAccount)

module.exports=routes