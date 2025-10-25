// routes/adminRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";
import User from "../models/User.js";
import Teacher from "../models/teacher.js";
import Subject from "../models/Subject.js";
import Payment from "../models/Payment.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

/* =====================================================
   🔹 ADMIN LOGIN
===================================================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   🔹 VERIFY ADMIN TOKEN
===================================================== */
router.get("/verify", verifyAdmin, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.json({
      success: true,
      admin,
      message: "Admin verified successfully",
    });
  } catch (err) {
    console.error("Admin verify route error:", err);
    res.status(500).json({ message: "Server error during verification" });
  }
});

/* =====================================================
   🔹 DASHBOARD DATA
===================================================== */
router.get("/dashboard", verifyAdmin, async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password");
    const teachers = await Teacher.find().select("-password");
    const qaos = await User.find({ role: "qao" }).select("-password");
    const admin = await Admin.findById(req.admin._id).select("-password");

    res.json({
      students,
      teachers,
      qaos,
      admin,
    });
  } catch (err) {
    console.error("Admin dashboard error:", err);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
});

/* =====================================================
   🔹 BROADCASTS
===================================================== */
router.get("/broadcasts", verifyAdmin, async (req, res) => {
  try {
    // Example placeholder: replace with actual broadcast model if exists
    const broadcasts = await Payment.find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(broadcasts);
  } catch (err) {
    console.error("Broadcast fetch error:", err);
    res.status(500).json({ message: "Failed to load broadcasts" });
  }
});

/* =====================================================
   🔹 PAYMENTS
===================================================== */

router.get("/payments", verifyAdmin, async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("studentId", "name email") // populate only name and email
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    console.error("Payment fetch error:", err);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
});


/* =====================================================
   🔹 STATS (Counts)
===================================================== */
router.get("/stats", verifyAdmin, async (req, res) => {
  try {
    const studentsCount = await User.countDocuments({ role: "student" });
    const teachersCount = await Teacher.countDocuments();
    const qaosCount = await User.countDocuments({ role: "qao" });
    const subjectsCount = await Subject.countDocuments();

    res.json({
      students: studentsCount,
      teachers: teachersCount,
      qaos: qaosCount,
      subjects: subjectsCount,
    });
  } catch (err) {
    console.error("Stats fetch error:", err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

/* =====================================================
   🔹 DELETE USER
===================================================== */
router.delete("/users/:id", verifyAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.remove();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

export default router;
