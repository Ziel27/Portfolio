import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@portfolio.com" });

    if (existingAdmin) {
      console.log("Admin account already exists!");
      console.log("Email: admin@portfolio.com");
      console.log("Password: Admin@Portfolio2024!");
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      email: "admin@portfolio.com",
      password: "Admin@Portfolio2024!",
      availableToWork: true,
    });

    console.log("Admin account created successfully!");
    console.log("Email: admin@portfolio.com");
    console.log("Password: Admin@Portfolio2024!");
    console.log("\n⚠️  IMPORTANT: Change this password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
