const mongoose = require("mongoose");

const groupChatSchema = mongoose.Schema(
  {
    name: { type: String },
    message: { type: String, required: true },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GroupChat", groupChatSchema);
