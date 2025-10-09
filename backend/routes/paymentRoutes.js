// routes/paymentRoutes.js
import express from "express";
import multer from "multer";
import Payment from "../models/Payment.js";

const router = express.Router();

// ✅ Configure multer for file uploads
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

// ✅ Submit payment route
router.post("/submit", upload.single("screenshot"), async (req, res) => {
  try {
    const { userId, curriculum, package: pkg, grade, subject, amount, referenceName } = req.body;

    if (!userId || !curriculum || !pkg || !subject || !amount || !referenceName) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // Convert comma-separated string to array if necessary
    const subjectsArray = Array.isArray(subject) 
      ? subject 
      : subject.split(",").map(s => s.trim());

    const payment = await Payment.create({
      userId,
      curriculum,
      package: pkg,
      grade,
      subject: subjectsArray, // ✅ store as array
      amount,
      referenceName,
      screenshot: req.file?.path,
    });

    res.status(201).json({ payment });
  } catch (err) {
    console.error("Payment submission error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
