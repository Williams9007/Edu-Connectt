import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import Assignment from "../models/Assignment.js";
import Teacher from "../models/teacher.js";
import Student from "../models/Student.js";

const router = express.Router();

// ==================== TEACHER SIGNUP ====================
router.post("/", async (req, res) => {
  try {
    const { fullName, email, phone, password, curriculum, experience } = req.body;

    if (!fullName || !email || !phone || !password || !curriculum || !experience) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) return res.status(400).json({ message: "Email already registered" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const teacher = await Teacher.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
      subjects: [],
      curriculum,
      experience,
    });

    res.status(201).json({ user: teacher });
  } catch (err) {
    console.error("Teacher signup error:", err);
    res.status(500).json({ message: "Server error during teacher signup" });
  }
});

// ==================== TEACHER DASHBOARD ====================
router.get("/dashboard", async (req, res) => {
  try {
    const teacherId = req.query.id; // For now, use query param
    if (!teacherId) return res.status(400).json({ message: "Teacher ID required" });

    const teacher = await Teacher.findById(teacherId)
      .populate("assignmentsGiven")
      .populate("subjects");

    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    res.json({ user: teacher });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching teacher dashboard" });
  }
});

// ==================== FORGOT PASSWORD (Send reset link) ====================
router.post("/forget-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const teacher = await Teacher.findOne({ email });
    if (!teacher)
      return res.status(404).json({ message: "No user found with this email" });

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 min expiry

    student.resetToken = resetToken;
    student.resetTokenExpiry = resetTokenExpiry;
    await student.save();

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    // ✅ Gmail transporter instead of Ethereal
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send reset email
    await transporter.sendMail({
      from: `"EduConnect Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>Hello ${teacher.fullName || "Teacher"},</p>
        <p>You requested a password reset. Click the link below to set a new one:</p>
        <a href="${resetLink}" target="_blank" 
          style="background:#4f46e5;color:#fff;padding:10px 20px;text-decoration:none;border-radius:6px;">
          Reset Password
        </a>
        <p>This link will expire in 15 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    res.json({ message: "✅ Password reset link sent! Check your email." });
  } catch (err) {
    console.error("❌ Error sending password reset email:", err);
    res.status(500).json({ message: "Server error sending reset email" });
  }
});

// ==================== RESET PASSWORD ====================
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const teacher = await Teacher.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!teacher) return res.status(400).json({ message: "Invalid or expired reset link" });

    const salt = await bcrypt.genSalt(10);
    teacher.password = await bcrypt.hash(newPassword, salt);
    teacher.resetToken = undefined;
    teacher.resetTokenExpiry = undefined;

    await teacher.save();

    res.json({ message: "✅ Password reset successful!" });
  } catch (err) {
    console.error("❌ Error resetting password:", err);
    res.status(500).json({ message: "Server error resetting password" });
  }
});

// ==================== ASSIGNMENT CRUD ====================
router.post("/assignments", async (req, res) => {
  try {
    const { title, description, subjectId, teacherId, dueDate } = req.body;

    if (!title || !description || !subjectId || !teacherId) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const assignment = await Assignment.create({
      title,
      description,
      subjectId,
      teacherId,
      dueDate,
    });

    await Teacher.findByIdAndUpdate(teacherId, { $push: { assignmentsGiven: assignment._id } });

    res.status(201).json({ assignment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error creating assignment" });
  }
});

// 🔹 POST /teacher/broadcast
router.post("/teacher/broadcast", async (req, res) => {
  try {
    const { teacherId, subjectId, message } = req.body;

    const teacher = await Teacher.findById(teacherId);
    const subject = await Subject.findById(subjectId);

    if (!teacher || !subject) {
      return res.status(404).json({ message: "Invalid teacher or subject" });
    }

    const broadcast = new Broadcast({
      teacher: teacherId,
      subject: subjectId,
      message,
    });
    await broadcast.save();

    res.json({ message: "Broadcast sent successfully", broadcast });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending broadcast" });
  }
});

// 🔹 GET /teacher/broadcasts/:teacherId
router.get("/teacher/broadcasts/:teacherId", async (req, res) => {
  try {
    const broadcasts = await Broadcast.find({ teacher: req.params.teacherId })
      .populate("subject", "name")
      .sort({ createdAt: -1 });

    res.json(
      broadcasts.map((b) => ({
        subjectName: b.subject?.name || "General",
        message: b.message,
        createdAt: b.createdAt,
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch broadcasts" });
  }
});

export default router;
