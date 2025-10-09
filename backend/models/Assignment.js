import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
subject: { 
  type: [String], // <-- array instead of single string
  required: true
},

  description: { type: String },
  status: { type: String, enum: ["pending", "submitted", "overdue"], default: "pending" },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  submission: { type: String }, // text submission
});

export default mongoose.model("Assignment", assignmentSchema);
