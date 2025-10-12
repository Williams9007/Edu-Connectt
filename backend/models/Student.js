import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },

  curriculum: { type: String, enum: ["GES", "CAMBRIDGE"], required: true },
  package: { type: String, required: true }, // subscription/package info
  grade: { type: String, required: true },

  subjectsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }], // references subjects
  assignmentsSubmitted: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }], // references assignments

}, { timestamps: true });

export default mongoose.model("Student", studentSchema);
