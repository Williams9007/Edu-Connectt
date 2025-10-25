import Broadcast from "../models/Broadcast.js";
import User from "../models/User.js";
import Teacher from "../models/teacher.js";
import QaoUser from "../models/QaoUser.js";
import Student from "../models/Student.js";
import ContactMessage from "../models/ContactMessage.js";
import nodemailer from "nodemailer";

/**
 * Admin: create a broadcast and optionally email recipients
 */
export const createBroadcast = async (req, res) => {
  const { recipients, message, type } = req.body;
  // type can be "students", "teachers", "qaos", or "all"
  try {
    const broadcast = await Broadcast.create({ sender: "admin", recipients, message, type });
    res.status(201).json(broadcast);
  } catch (err) {
    console.error("❌ createBroadcast simple error:", err);
    res.status(500).json({ message: "Error creating broadcast" });
  }
};

/**
 * Admin: get all broadcasts (paginated optional)
 */
export const getAllBroadcasts = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const broadcasts = await Broadcast.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    res.json({ success: true, broadcasts });
  } catch (error) {
    console.error("❌ getAllBroadcasts error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch broadcasts" });
  }
};

/**
 * Admin: create a user (student/teacher/qao)
 */
export const createUser = async (req, res) => {
  try {
    const { name, email, role, password, extra } = req.body;

    if (!name || !email || !role) return res.status(400).json({ success: false, message: "name, email and role are required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: "User already exists" });

    const newUser = new User({ name, email, role, password });
    // allow extra metadata
    if (extra) newUser.extra = extra;
    await newUser.save();

    // if role-specific models are used, create corresponding documents (best-effort)
    if (role === "teacher") {
      const t = new Teacher({ userId: newUser._id, name, email, subjects: extra?.subjects || [] });
      await t.save();
    }

    if (role === "student") {
      const s = new Student({ userId: newUser._id, name, email, subjects: extra?.subjects || [] });
      await s.save();
    }

    if (role === "qao") {
      const q = new QaoUser({ userId: newUser._id, name, email });
      await q.save();
    }

    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.error("❌ createUser error:", error);
    res.status(500).json({ success: false, message: "Failed to create user" });
  }
};

/**
 * Admin: delete user by id. Try to remove references in role-specific collections.
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: "User not found" });

    // cleanup in role collections
    await Teacher.deleteMany({ userId: id });
    await Student.deleteMany({ userId: id });
    await QaoUser.deleteMany({ userId: id });

    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    console.error("❌ deleteUser error:", error);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
};
