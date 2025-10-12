import express from "express";
import multer from "multer";
import Payment from "../models/Payment.js";

const router = express.Router();

// ==================== Configure multer for file uploads ====================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ==================== Submit payment ====================
router.post("/submit", upload.single("screenshot"), async (req, res) => {
  try {
    const { studentId, curriculum, package: pkg, grade, subjects, amount, referenceName, transactionDate } = req.body;

    if (!studentId || !curriculum || !pkg || !subjects || !amount || !referenceName) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const subjectsArray = Array.isArray(subjects)
      ? subjects
      : subjects.split(",").map(s => s.trim());

    const payment = await Payment.create({
      studentId,
      curriculum,
      package: pkg,
      grade,
      subjects: subjectsArray,
      amount,
      referenceName,
      screenshot: req.file?.path,
      transactionDate: transactionDate || new Date(),
    });

    res.status(201).json({ payment });
  } catch (err) {
    console.error("Payment submission error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ==================== Get all payments ====================
router.get("/", async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("studentId", "fullName email grade")
      .lean();
    res.json(payments);
  } catch (err) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ message: err.message });
  }
});

// ==================== Get single payment ====================
router.get("/:id", async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("studentId", "fullName email grade")
      .lean();
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json(payment);
  } catch (err) {
    console.error("Error fetching payment:", err);
    res.status(500).json({ message: err.message });
  }
});

// ==================== Update payment ====================
router.put("/:id", async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json(payment);
  } catch (err) {
    console.error("Error updating payment:", err);
    res.status(500).json({ message: err.message });
  }
});

// ==================== Delete payment ====================
router.delete("/:id", async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json({ message: "Payment deleted successfully" });
  } catch (err) {
    console.error("Error deleting payment:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
