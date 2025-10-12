import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },

  // New fields
  curriculum: { type: String, enum: ["GES", "CAMBRIDGE"], required: true }, // curriculum teacher teaches
  subjectsTeaching: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }], // references subjects
  assignmentsGiven: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }], // assignments teacher created
  lessonNotes: [{ 
    title: String,
    content: String,
    createdAt: { type: Date, default: Date.now }
  }], // embedded lesson notes

  experience: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Teacher", teacherSchema);
