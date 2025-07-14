const mongoose = require("mongoose");
const conversationSchema = mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ride",
      },
    ],
    rideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "live-ride",
      required: true,
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "message",
      },
    ],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("conversation", conversationSchema);
