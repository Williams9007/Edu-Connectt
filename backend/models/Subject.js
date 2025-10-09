import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  teacher: { type: String, required: true },
  progress: { type: Number, default: 0 }, // student progress %
});

export default mongoose.model("Subject", subjectSchema);
