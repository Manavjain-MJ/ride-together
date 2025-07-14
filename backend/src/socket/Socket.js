const http = require("http");
const { Server } = require("socket.io");
const express = require("express");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`User Connected : userId = ${userId},SocketId=${socket.id}`);
  }
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("sendMessage", (msg) => {
    const { senderId, receiverId } = msg;

    // Check if the receiver is online and emit the message to them
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", msg);
    }

    // Optionally, send the message back to the sender (for immediate view)
    const senderSocketId = userSocketMap[senderId];
    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", msg);
    }
  });
  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
      console.log(`User Connected : userId = ${userId},SocketId=${socket.id}`);
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});
// socket.on("sendMessage", (msg) => {
//   const { senderId, receiverId } = msg;

//   // Check if receiver is online and emit the message to them
//   const receiverSocketId = userSocketMap[receiverId];
//   if (receiverSocketId) {
//     io.to(receiverSocketId).emit("newMessage", msg);
//   }

//   // Optionally, also send the message back to the sender (for immediate view)
//   const senderSocketId = userSocketMap[senderId];
//   if (senderSocketId) {
//     io.to(senderSocketId).emit("newMessage", msg);
//   }
// });

module.exports = { app, server, io ,userSocketMap};
