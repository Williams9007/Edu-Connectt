import mongoose from "mongoose";
import dotenv from "dotenv";
import Subject from "./models/Subject.js";

dotenv.config();

const dummyTeacherId = new mongoose.Types.ObjectId(); // temporary teacher ID for seeding

const subjects = [
  // GES Subjects
  {
    name: "English",
    curriculum: "GES",
    teacherId: dummyTeacherId,
    classTime: "8:00 AM",
  },
  {
    name: "Maths",
    curriculum: "GES",
    teacherId: dummyTeacherId,
    classTime: "9:00 AM",
  },
  {
    name: "Science",
    curriculum: "GES",
    teacherId: dummyTeacherId,
    classTime: "10:00 AM",
  },

  // Cambridge Subjects
  {
    name: "English",
    curriculum: "CAMBRIDGE",
    teacherId: dummyTeacherId,
    classTime: "8:00 AM",
  },
  {
    name: "Core Math",
    curriculum: "CAMBRIDGE",
    teacherId: dummyTeacherId,
    classTime: "9:00 AM",
  },
  {
    name: "Science(Biology)",
    curriculum: "CAMBRIDGE",
    teacherId: dummyTeacherId,
    classTime: "10:00 AM",
  },
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
