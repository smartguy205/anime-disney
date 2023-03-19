const mongoose = require("mongoose");

const privateChatSchema = mongoose.Schema(
  {
    name: { type: String },
    message: { type: String, required: true },
    sender: {
      type: String,
    },
    attachment: {
      type: String,
    },
    clientid: {
      type: String,
    },
    isPrivate: {
      type: Boolean,
    },
    sender: {},
    userId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PrivateChat", privateChatSchema);
