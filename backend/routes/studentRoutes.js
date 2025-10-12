import express from "express";
import Student from "../models/Student.js";
import Payment from "../models/Payment.js";
import Subject from "../models/Subject.js";

const router = express.Router();

// ==================== Student Signup ====================
router.post("/", async (req, res) => {
  try {
    const { fullName, email, phone, password, curriculum, package: pkg, grade, subjects, amount } = req.body;

    if (!fullName || !email || !phone || !password || !curriculum || !pkg || !grade || !subjects || subjects.length < 2) {
      return res.status(400).json({ message: "All required fields must be provided and at least 2 subjects selected" });
    }

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) return res.status(400).json({ message: "Email already registered" });

    const student = await Student.create({
      fullName,
      email,
      phone,
      password, // Ideally: hash password before saving
      curriculum,
      package: pkg,
      grade,
      subjects,
      amount,
    });

    res.status(201).json({ user: student });
  } catch (err) {
    console.error("Student signup error:", err);
    res.status(500).json({ message: "Server error during student signup" });
  }
});

// ==================== Get student by ID with subjects and payments ====================
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .select("-password")
      .lean();

    if (!student) return res.status(404).json({ message: "Student not found" });

    // Fetch enrolled subjects
    let subjectsEnrolled = [];
    if (student.subjects && student.subjects.length > 0) {
      subjectsEnrolled = await Subject.find({ _id: { $in: student.subjects } })
        .select("name curriculum time teacher")
        .lean();
    }

    // Fetch payments
    const payments = await Payment.find({ userId: student._id }).lean();

    res.json({ user: student, subjects: subjectsEnrolled, payments });
  } catch (err) {
    console.error("Error fetching student by ID:", err);
    res.status(500).json({ message: "Server error fetching student" });
  }
});

// ==================== Update student info ====================
router.put("/:id", async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedStudent) return res.status(404).json({ message: "Student not found" });
    res.json({ user: updatedStudent });
  } catch (err) {
    console.error("Error updating student:", err);
    res.status(500).json({ message: "Server error updating student" });
  }
});

// ==================== Delete student ====================
router.delete("/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    // Also delete related payments
    await Payment.deleteMany({ userId: req.params.id });
    res.json({ message: "Student and related payments deleted" });
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).json({ message: "Server error deleting student" });
  }
});

export default router;
