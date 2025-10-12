import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Student", 
    required: true 
  },
  curriculum: { 
    type: String, 
    enum: ["GES", "CAMBRIDGE"], 
    required: true 
  },
  package: { 
    type: String, 
    required: true 
  },
  grade: { 
    type: String 
  },
  subjects: { 
    type: [String], // array of subjects the payment covers
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  referenceName: { 
    type: String, 
    required: true 
  },
  screenshot: { 
    type: String, // URL or file path
    required: true
  },
  transactionDate: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["pending", "confirmed", "rejected"], 
    default: "pending" 
  },
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);
