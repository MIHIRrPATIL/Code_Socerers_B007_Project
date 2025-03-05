import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { sendMessage, getChat } from "../controllers/chatControllers.js";

const router = express.Router();

router.post("/send", verifyToken, sendMessage);
router.get("/:chatId", verifyToken, getChat);

export default router;
