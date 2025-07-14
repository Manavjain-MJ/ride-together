const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    rideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "live-ride",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ride",
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ride",
    },
    message: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("message", messageSchema);
