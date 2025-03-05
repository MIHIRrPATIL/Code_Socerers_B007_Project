import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  text: String,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Message", messageSchema);
