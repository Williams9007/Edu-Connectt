// backend/routes/qaoRoutes.js
import express from "express";
import dotenv from "dotenv";
import QaoUser from "../models/QaoUser.js"; 
import Subject from "../models/Subject.js";
import Message from "../models/Message.js";
import { verifyQao } from "../middleware/verifyQao.js";

dotenv.config();
const router = express.Router();

/**
 * ✅ POST /api/qao/access
 * Simple access route for QAO login/auth
 */
router.post("/access", (req, res) => {
  const { qaoCode } = req.body;

  // Replace this with your actual secret access code
  const validCode = "QAO2025_SECRET";

  if (qaoCode === validCode) {
    return res.json({
      success: true,
      message: "QAO access granted",
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Invalid QAO access code",
    });
  }
});


// 🔹 QAO → Teacher (send message)
router.post("/broadcast", verifyQao, async (req, res) => {
  try {
    const { recipients, subject, message } = req.body;
    const senderId = req.user.id; // from token
    const senderRole = "qao";

    if (!recipients || recipients.length === 0) {
      return res.status(400).json({ message: "No recipients provided" });
    }

    const messages = recipients.map((receiverId) => ({
      sender: senderId,
      receiver: receiverId,
      subject,
      message,
      senderRole,
      receiverRole: "teacher",
    }));

    await Message.insertMany(messages);
    res.status(200).json({ success: true, message: "Messages sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Fetch messages sent by QAO
router.get("/sent", verifyQao, async (req, res) => {
  const messages = await Message.find({ sender: req.user.id })
    .populate("receiver", "name email role")
    .sort({ createdAt: -1 });
  res.json(messages);
});

// 🔹 Fetch messages received by QAO
router.get("/inbox", verifyQao, async (req, res) => {
  const messages = await Message.find({ receiver: req.user.id })
    .populate("sender", "name email role")
    .sort({ createdAt: -1 });
  res.json(messages);
});


/**
 * ✅ GET /api/qao/users
 * Fetch QAO users and their assigned subjects
 */
router.get("/users", async (req, res) => {
  try {
    const qaoUsers = await QaoUser.find().select("name email assignedSubjects");
    // Optional: populate assigned subjects if needed
    // const qaoUsers = await QaoUser.find().populate("assignedSubjects", "name");

    res.json({ success: true, qaoUsers });
  } catch (error) {
    console.error("QAO fetch users error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
