const routes = require("express").Router()

const cityControllers=require("../controllers/CityControllers")

routes.post("/addcity",cityControllers.addCity)
routes.get("/getcities",cityControllers.getAllCities)

module.exports = routes