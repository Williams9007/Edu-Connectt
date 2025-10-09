// backend/seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.js";
import Subject from "./models/subject.js";
import Assignment from "./models/assignment.js";
import Payment from "./models/Payment.js";
import bcrypt from "bcryptjs";


dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/test";

async function seedData() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected for seeding...");

    // Clear old data
    await User.deleteMany({});
    await Subject.deleteMany({});
    await Assignment.deleteMany({});
    await Payment.deleteMany({});
    console.log("🧹 Old data cleared");

    // Users
    const users = [
  { fullName: "Kwame Mensah", email: "kwame@example.com", password: await bcrypt.hash("123456", 10), role: "student" },
  { fullName: "Ama Serwaa", email: "ama@example.com", password: await bcrypt.hash("123456", 10), role: "student" },
  { fullName: "Mr. Opoku", email: "opoku@example.com", password: await bcrypt.hash("123456", 10), role: "teacher" },
  { fullName: "Ms. Adjoa", email: "adjoa@example.com", password: await bcrypt.hash("123456", 10), role: "teacher" },
];


    await User.insertMany(users);

    // Subjects
    const subjects = [
      { name: "Mathematics", teacher: "Mr. Opoku", progress: 50 },
      { name: "Science", teacher: "Mr. Opoku", progress: 30 },
    ];
    await Subject.insertMany(subjects);

    // Assignments
    const assignments = [
      {
        title: "Algebra Homework",
        description: "Complete exercises 1-10",
        subject: "Mathematics",
        status: "pending",
      },
      {
        title: "Physics Lab Report",
        description: "Submit lab report on forces",
        subject: "Science",
        status: "pending",
      },
    ];
    await Assignment.insertMany(assignments);

    // Payments (store as numbers)
    const payments = [
      { subject: "Mathematics", amount: 50, status: "pending", date: new Date() },
      { subject: "Science", amount: 40, status: "pending", date: new Date() },
    ];
    await Payment.insertMany(payments);

    console.log("✅ Seeding complete!");
    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    mongoose.disconnect();
  }
}

seedData();
