const tryCatchAsync = require("../../../util/tryCatchAsync");
const apiResponse = require("../../../util/apiResponse");
const Messages = require("../Models/Messages");
const GroupChat = require("../Models/GroupChat");
const { success } = require("../../../util/statusCode").statusCode;

exports.addChat = tryCatchAsync(async (req, res) => {
  const { sender, name, message } = req.body;
  const data = await GroupChat.create({
    name,
    message,
    sender: sender,
  });

  let response_data = { message: data };
  return apiResponse.successResponse(res, response_data, "", success);
});

exports.getChat = tryCatchAsync(async (req, res) => {
  const chat = await GroupChat.find().populate("sender").sort({ updatedAt: 1 });

  let response_data = { messages: chat };
  return apiResponse.successResponse(res, response_data, "", success);
});

exports.addMessage = tryCatchAsync(async (req, res) => {
  const { from, to, message } = req.body;
  const data = await Messages.create({
    message: {
      text: message,
    },
    users: [from, to],
    sender: from,
  });

  let response_data = { message: data };
  return apiResponse.successResponse(res, response_data, "", success);
});

exports.getAllMessage = tryCatchAsync(async (req, res) => {
  const { from, to } = req.body;
  const messages = await Messages.find({
    users: {
      $all: [from, to],
    },
  }).sort({ updatedAt: 1 });

  const projectMessages = messages.map((msg) => {
    return {
      fromSelf: msg.sender.toString() === from,
      message: msg.message.text,
    };
  });

  let response_data = { messages: projectMessages };
  return apiResponse.successResponse(res, response_data, "", success);
});
