import mongoose from "mongoose";
import dotenv from "dotenv";
import Subject from "./models/Subject.js"; // ✅ Make sure this path points to your Subject model

dotenv.config();

const subjects = [
  // GES Curriculum Subjects
  { name: "English", curriculum: "GES", teacher: "Mr. John", classTime: "8:00 AM" },
  { name: "Maths", curriculum: "GES", teacher: "Ms. Grace", classTime: "9:00 AM" },
  { name: "Science", curriculum: "GES", teacher: "Mr. Paul", classTime: "10:00 AM" },

  // Cambridge Curriculum Subjects
  { name: "English", curriculum: "CAMBRIDGE", teacher: "Mr. Adams", classTime: "8:00 AM" },
  { name: "Mathematics", curriculum: "CAMBRIDGE", teacher: "Mrs. White", classTime: "9:00 AM" },
  { name: "Biology", curriculum: "CAMBRIDGE", teacher: "Dr. Green", classTime: "10:00 AM" },
];

const seedSubjects = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Subject.deleteMany({});
    await Subject.insertMany(subjects);
    console.log("✅ Subjects seeded successfully!");

    process.exit();
  } catch (err) {
    console.error("❌ Error seeding subjects:", err);
    process.exit(1);
  }
};

seedSubjects();
