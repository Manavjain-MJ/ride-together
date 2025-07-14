const routes = require("express").Router()
const ratingControllers = require("../controllers/RatingControllers")

routes.post("/addrating",ratingControllers.addRatings)
routes.get("/getrating",ratingControllers.getAllRatings)

module.exports = routes