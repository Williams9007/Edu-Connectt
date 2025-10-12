import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  curriculum: { type: String, enum: ["GES", "CAMBRIDGE"], required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true }, // Reference to Teacher
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }], // Array of student references
  classTime: { type: String, default: "To be scheduled" }, // Time of the class
  progress: { type: Number, default: 0 }, // optional progress tracking
}, { timestamps: true });

export default mongoose.model("Subject", subjectSchema);
