import express from "express";
import Subject from "../models/Subject.js";
import Teacher from "../models/teacher.js";
import Student from "../models/Student.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// ==================== Create a new subject ====================
router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, curriculum, teacherId, classTime } = req.body;

    if (!name || !curriculum || !teacherId) {
      return res.status(400).json({ message: "Name, curriculum, and teacherId are required" });
    }

    const subject = await Subject.create({
      name,
      curriculum,
      teacherId,
      classTime: classTime || "To be scheduled",
    });

    // Add subject to teacher's subjectsTeaching
    await Teacher.findByIdAndUpdate(teacherId, { $push: { subjectsTeaching: subject._id } });

    res.status(201).json(subject);
  } catch (err) {
    console.error("Error creating subject:", err);
    res.status(500).json({ message: err.message });
  }
});

// ==================== Get all subjects ====================
router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate("teacherId", "fullName email")
      .populate("enrolledStudents", "fullName email grade")
      .lean();
    res.json(subjects);
  } catch (err) {
    console.error("Error fetching subjects:", err);
    res.status(500).json({ message: err.message });
  }
});

// ==================== Get single subject ====================
router.get("/:id", async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate("teacherId", "fullName email")
      .populate("enrolledStudents", "fullName email grade")
      .lean();
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    res.json(subject);
  } catch (err) {
    console.error("Error fetching subject:", err);
    res.status(500).json({ message: err.message });
  }
});

// ==================== Update subject ====================
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    res.json(subject);
  } catch (err) {
    console.error("Error updating subject:", err);
    res.status(500).json({ message: err.message });
  }
});

// ==================== Delete subject ====================
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    // Remove subject from teacher's subjectsTeaching
    await Teacher.findByIdAndUpdate(subject.teacherId, { $pull: { subjectsTeaching: subject._id } });

    // Remove subject from all enrolled students
    await Student.updateMany({ subjectsEnrolled: subject._id }, { $pull: { subjectsEnrolled: subject._id } });

    res.json({ message: "Subject deleted successfully" });
  } catch (err) {
    console.error("Error deleting subject:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
