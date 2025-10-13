import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Student from "../models/Student.js";
import Payment from "../models/Payment.js";
import Subject from "../models/Subject.js";
import { sendWelcomeEmail } from "../message/sendWelcomeEmail.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// ==================== REGISTER STUDENT ====================
router.post("/register", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      curriculum,
      package: pkg,
      grade,
      subjects,
      amount,
      startDate,
      finishDate,
      studyDuration,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !phone ||
      !password ||
      !curriculum ||
      !pkg ||
      !grade ||
      !subjects ||
      subjects.length < 2
    ) {
      return res.status(400).json({
        message:
          "All required fields must be provided and at least 2 subjects selected",
      });
    }

    const existingStudent = await Student.findOne({ email });
    if (existingStudent)
      return res.status(400).json({ message: "Email already registered" });

    const foundSubjects = await Subject.find({
      curriculum,
      name: { $in: subjects.map((s) => new RegExp(`^${s}$`, "i")) },
    });

    if (!foundSubjects.length)
      return res.status(400).json({
        message: "No matching subjects found for selected curriculum",
      });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const student = new Student({
      fullName,
      email,
      phone,
      password: hashedPassword,
      curriculum,
      package: pkg,
      grade,
      subjectsEnrolled: foundSubjects.map((s) => s._id),
      amount,
      startDate,
      finishDate,
      studyDuration,
    });

    await student.save();

    await Subject.updateMany(
      { _id: { $in: foundSubjects.map((s) => s._id) } },
      { $push: { enrolledStudents: student._id } }
    );

    // ✅ Send welcome email
    const subjectNames = subjects.join(", ");
    try {
      await sendWelcomeEmail(
        email,
        fullName,
        pkg,
        subjectNames,
        startDate || "N/A",
        finishDate || "N/A",
        studyDuration || "3 months"
      );
    } catch (emailError) {
      console.error("❌ Error sending welcome email:", emailError);
    }

    // ✅ Generate token for immediate login
    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "Student registered successfully",
      user: student,
      token,
    });
  } catch (err) {
    console.error("❌ Student signup error:", err);
    res.status(500).json({ message: "Server error during student signup" });
  }
});

// ==================== LOGIN STUDENT ====================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (!student)
      return res.status(404).json({ message: "User not found. Please sign up." });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ message: "Login successful", user: student, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// ==================== GET CURRENT STUDENT (via token) ====================
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const student = await Student.findById(decoded.id)
      .populate("subjectsEnrolled", "name curriculum classTime teacherId")
      .select("-password");

    if (!student)
      return res.status(404).json({ message: "Student not found" });

    const payments = await Payment.find({ studentId: student._id });
    res.json({ user: student, subjects: student.subjectsEnrolled, payments });
  } catch (err) {
    console.error("Error fetching current student:", err);
    res.status(500).json({ message: "Server error fetching student" });
  }
});

// ==================== GET STUDENT BY ID ====================
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID format" });
    }

    const student = await Student.findById(req.params.id)
      .populate("subjectsEnrolled", "name curriculum classTime teacherId")
      .select("-password");

    if (!student)
      return res.status(404).json({ message: "Student not found" });

    const payments = await Payment.find({ studentId: student._id });
    res.json({ user: student, subjects: student.subjectsEnrolled, payments });
  } catch (err) {
    console.error("Error fetching student by ID:", err);
    res.status(500).json({ message: "Server error fetching student" });
  }
});

// ==================== FORGOT PASSWORD ====================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const student = await Student.findOne({ email });
    if (!student)
      return res.status(404).json({ message: "User not found" });

    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(newPassword, salt);
    await student.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(500).json({ message: "Server error resetting password" });
  }
});

export default router;
