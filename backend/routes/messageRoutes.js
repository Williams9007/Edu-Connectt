import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

// Send new message (QAO → Teacher)
router.post("/send", async (req, res) => {
  try {
    const { senderId, recipientId, subject, message } = req.body;
    const newMessage = await Message.create({ senderId, recipientId, subject, message });
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

// Get inbox messages (for teacher)
router.get("/inbox/:userId", async (req, res) => {
  try {
    const messages = await Message.find({ recipientId: req.params.userId })
      .populate("senderId", "name email")
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to load inbox" });
  }
});

// Reply to message (Teacher → QAO)
router.post("/reply", async (req, res) => {
  try {
    const { senderId, recipientId, message, replyTo } = req.body;
    const reply = await Message.create({ senderId, recipientId, message, replyTo });
    res.status(201).json(reply);
  } catch (err) {
    res.status(500).json({ error: "Failed to send reply" });
  }
});

export default router;
