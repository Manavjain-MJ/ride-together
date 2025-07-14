const routes = require("express").Router()
const notificationControllers = require("../controllers/NotificationControllers")
const { route } = require("./RoleRoute")

routes.post("/addnotification",notificationControllers.addNotification)
routes.get("/getnotification",notificationControllers.getAllNotification)
module.exports = routes