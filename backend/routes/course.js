// routes/course.js
import express from "express";
import User from "../models/user.js";

const router = express.Router();

// POST /api/course/register
router.post("/register", async (req, res) => {
  try {
    const { userId, curriculum } = req.body;

    if (!userId || !curriculum) return res.status(400).json({ error: "userId and curriculum are required" });
    if (!["GES", "Cambridge"].includes(curriculum)) return res.status(400).json({ error: "Invalid curriculum" });

    const user = await User.findByIdAndUpdate(
      userId,
      { curriculum },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: `Registered for ${curriculum}`, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
