const routes = require("express").Router();

const messagesControllers = require("../controllers/MessageControllers");
const ConversationModel = require("../models/ConversationModel");

routes.post("/sendmessage/:id", messagesControllers.sendMessage);
routes.get("/readmessage/all/:id", messagesControllers.getMessage);
module.exports = routes;
