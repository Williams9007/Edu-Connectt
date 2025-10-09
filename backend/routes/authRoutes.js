// routes/authRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import multer from "multer";
import User from "../models/user.js"; 

const router = express.Router();

// Multer setup for teacher CV upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/cv"); // folder to store CVs
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Signup route (handles students and teachers)
router.post("/signup", upload.single("cv"), async (req, res) => {
  try {
    let data = {};
    let role = "";

    // Teacher sends FormData with file
    if (req.file) {
      data = req.body;
      role = data.role || "teacher";
    } else {
      // Student sends JSON
      data = req.body;
      role = data.role || "student";
    }

    const {
      fullName,
      email,
      password,
      phone,
      curriculum,
      package: selectedPackage,
      grade,
      subjects,
      amount,
      experience,
    } = data;

    // Validate required fields
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Full name, email, and password are required" });
    }

    if (role === "student") {
      if (!phone || !curriculum || !selectedPackage || !grade || !subjects || !amount) {
        return res.status(400).json({
          message: "Missing required student fields: phone, curriculum, package, grade, subjects, or amount",
        });
      }
    }

    if (role === "teacher") {
      if (!phone || !curriculum || !experience) {
        return res.status(400).json({
          message: "Missing required teacher fields: phone, curriculum, or years of experience",
        });
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Build user object
    const userData = {
      fullName,
      email,
      password: hashedPassword,
      role,
      phone,
      curriculum,
      active: role === "teacher" ? false : true, // teacher inactive until admin activates
    };

    if (role === "student") {
      userData.package = selectedPackage;
      userData.grade = grade;
      userData.subjects = subjects;
      userData.amount = amount;
    }

    if (role === "teacher") {
      userData.experience = experience;
      userData.cvPath = req.file?.path || null;
    }

    const user = new User(userData);
    await user.save();

    const message =
      role === "teacher"
        ? "Teacher account created! An interview will be conducted and you will be informed."
        : "Student signup successful!";

    res.status(201).json({ message, user });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error during signup" });
  }
});

export default router;
