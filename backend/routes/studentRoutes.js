// routes/studentRoutes.js
import express from "express";
import User from "../models/user.js";
import Payment from "../models/Payment.js";

const router = express.Router();

// GET all students with their subjects and payments
router.get("/", async (req, res) => {
  try {
    // Fetch all students (exclude password)
    const students = await User.find({ role: "student" })
      .select("-password")
      .lean();

    // Attach payments for each student
    const studentsWithPayments = await Promise.all(
      students.map(async (student) => {
        try {
          const payments = await Payment.find({ userId: student._id }).lean();
          return { ...student, payments };
        } catch (err) {
          console.error("Error fetching payments for student:", student._id, err);
          return { ...student, payments: [] };
        }
      })
    );

    res.json(studentsWithPayments);
  } catch (err) {
    console.error("Server error fetching student data", err);
    res.status(500).json({ message: "Server error fetching student data" });
  }
});

export default router;
