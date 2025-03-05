import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

export const sendMessage = async (req, res) => {
  const { chatId, text } = req.body;
  const sender = req.user.userId;

  const message = new Message({ sender, chat: chatId, text });
  await message.save();

  await Chat.findByIdAndUpdate(chatId, { $push: { messages: message._id } });

  res.json(message);
};

export const getChat = async (req, res) => {
  const chat = await Chat.findById(req.params.chatId).populate("messages");
  res.json(chat);
};
