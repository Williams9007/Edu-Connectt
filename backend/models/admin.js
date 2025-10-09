import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  adminCode: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Admin", adminSchema);

