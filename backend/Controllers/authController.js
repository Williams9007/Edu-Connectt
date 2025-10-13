import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Student from "../models/Student.js";
import Teacher from "../models/teacher.js";
import Admin from "../models/admin.js";

// ===========================
// ✅ REGISTER USER
// ===========================
export const registerUser = async (req, res) => {
  try {
    const { role, email, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let user;
    if (role === "student") {
      user = await Student.create({ ...req.body, password: hashedPassword });
    } else if (role === "teacher") {
      user = await Teacher.create({ ...req.body, password: hashedPassword });
    } else if (role === "admin") {
      user = await Admin.create({ ...req.body, password: hashedPassword });
    } else {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    res.status(201).json({
      success: true,
      message: `${role} registered successfully`,
      user,
    });
  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

// ===========================
// ✅ LOGIN USER
// ===========================
export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Find user in the correct collection
    let user;
    if (role === "student") user = await Student.findOne({ email });
    if (role === "teacher") user = await Teacher.findOne({ email });
    if (role === "admin") user = await Admin.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};
