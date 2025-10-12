import express from "express";
import Assignment from "../models/Assignment.js";
import Teacher from "../models/teacher.js";
import Student from "../models/Student.js";

const router = express.Router();

// ==================== Teacher Signup ====================
router.post("/", async (req, res) => {
  try {
    const { fullName, email, phone, password, curriculum, experience } = req.body;

    if (!fullName || !email || !phone || !password || !curriculum || !experience) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) return res.status(400).json({ message: "Email already registered" });

    const teacher = await Teacher.create({
      fullName,
      email,
      phone,
      password, // ✅ Ideally hash password before saving
      subjects: [], // Start with empty subjects array
      experience,
    });

    res.status(201).json({ user: teacher });
  } catch (err) {
    console.error("Teacher signup error:", err);
    res.status(500).json({ message: "Server error during teacher signup" });
  }
});

// ==================== Teacher Dashboard ====================
router.get("/dashboard", async (req, res) => {
  try {
    // Replace verifyToken with actual logged-in teacher logic if needed
    const teacherId = req.query.id; // For testing without auth
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

// ==================== Assignment CRUD (remain unchanged) ====================
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

export default router;
