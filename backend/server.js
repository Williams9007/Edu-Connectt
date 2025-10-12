import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./Config/db.js";
import path from "path";
import { fileURLToPath } from "url";

// Import routes
import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import courseRoutes from "./routes/course.js";
import roleRoutes from "./routes/roleRoutes.js";

dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();

// ==================== Middleware ====================
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve uploaded files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve screenshots

// ==================== Routes ====================
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/roles", roleRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("EduConnect API is running");
});

// ==================== Error handling middleware ====================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// ==================== Start server ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
