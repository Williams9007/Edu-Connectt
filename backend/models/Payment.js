import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    curriculum: { 
      type: String, 
      enum: ["GES", "Cambridge"], 
      required: true 
    },
    package: { 
      type: String, 
      required: true 
    },
    grade: { 
      type: String 
    },
    subject: { 
      type: [String], // <-- changed to array
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
      type: String 
    },
    status: { 
      type: String, 
      enum: ["pending", "confirmed", "rejected"], 
      default: "pending" 
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
