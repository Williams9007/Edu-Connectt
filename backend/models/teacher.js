import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  experience: { type: String, required: true },
  subjects: { type: [String], required: true },
}, { timestamps: true });

export default mongoose.model("Teacher", teacherSchema);
