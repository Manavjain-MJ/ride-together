const routes = require("express").Router()
const paymentControllers = require("../controllers/PaymentControllers")
 
routes.post("/addpayment",paymentControllers.addPayment)
routes.get("/getpayment",paymentControllers.getAllPayment)

module.exports = routes