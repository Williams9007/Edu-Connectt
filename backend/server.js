import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import fs from 'fs';
import { fileURLToPath } from 'url';

import authRoutes from "./routes/authRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import courseRoutes from "./routes/course.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";

const app = express(); // ✅ Must come BEFORE using routes

// ===== Middleware =====
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// ✅ Serve uploaded screenshots statically
app.use("/uploads", express.static("uploads"));

// Resolve __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create upload directory for CVs if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads', 'cv');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Created directory: ${uploadDir}`);
}

// ===== MongoDB Connection =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection failed:", err));

// ===== Test Root Route =====
app.get("/", (req, res) => res.send("API is running..."));

// ===== API Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/role", roleRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/student", studentRoutes); // ✅ Make sure this is BELOW app initialization

// ===== Server Start =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
