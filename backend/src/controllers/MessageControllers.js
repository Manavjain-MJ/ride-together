// {const { get } = require("mongoose");}
const Conversation = require("../models/ConversationModel");
const messageModel = require("../models/MessageModel");
const { io, userSocketMap } = require("../socket/Socket");

const sendMessage = async (req, res) => {
  try {
    const { senderId, rideId, message } = req.body;
    const receiverId = req.params.id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
      rideId: rideId,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        rideId: rideId,
      });
    }

    const newMessage = await messageModel.create({
      senderId,
      receiverId,
      rideId,
      message,
    });

    if (newMessage) conversation.messages.push(newMessage._id);

    await Promise.all([conversation.save(), newMessage.save()]);

    const receiverSocketId = userSocketMap[receiverId]; // Get receiver's socketId
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    const senderSocketId = userSocketMap[senderId]; // Get sender's socketId
    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({
      success: true,
      newMessage,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

const getMessage = async (req, res) => {
  try {
    const senderId = req.query.senderId;
    const receiverId = req.params.id;
    const rideId = req.query.rideId;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
      rideId: rideId,
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json({ success: true, messages: [] });
    }

    res.status(200).json({ success: true, messages: conversation.messages });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

module.exports = {
  sendMessage,
  getMessage,
};
