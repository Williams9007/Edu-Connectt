import express from "express";
import User from "../models/user.js";
import authMiddleware from "../middleware/auth.js"; // Optional: ensure user is logged in

const router = express.Router();

/**
 * POST /api/role/select-role
 * Body: { userId, role }
 * Purpose: Set the user's role (student or teacher)
 */
router.post("/select-role", authMiddleware, async (req, res) => {
  try {
    const { userId, role } = req.body;

    // Check if role is valid
    const validRoles = ["student", "teacher"];
    if (!role || !validRoles.includes(role.toLowerCase())) {
      return res.status(400).json({ error: "Invalid role. Must be 'student' or 'teacher'" });
    }

    // Update the user role in the database
    const user = await User.findByIdAndUpdate(
      userId,
      { role: role.toLowerCase() },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json({
      success: true,
      message: `Role successfully set to ${role}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error in /select-role:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
