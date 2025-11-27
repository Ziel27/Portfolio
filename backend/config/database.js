import mongoose from "mongoose";
import User from "../models/User.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Create default admin account if it doesn't exist (only in development)
    // In production, use the create-admin script instead
    if (
      process.env.NODE_ENV === "development" &&
      process.env.CREATE_DEFAULT_ADMIN === "true"
    ) {
      try {
        const adminExists = await User.findOne({
          email: "admin@portfolio.com",
        });
        if (!adminExists) {
          const defaultPassword =
            process.env.DEFAULT_ADMIN_PASSWORD || "Admin@Portfolio2024!";
          await User.create({
            email: "admin@portfolio.com",
            password: defaultPassword,
            availableToWork: true,
            themeMode: "auto",
          });
          console.log("✅ Default admin account created!");
          console.log("   Email: admin@portfolio.com");
          console.log(`   Password: ${defaultPassword}`);
          console.log(
            "   ⚠️  IMPORTANT: Change this password after first login!"
          );
        }
      } catch (adminError) {
        // Ignore errors if admin already exists or other issues
        if (adminError.code !== 11000) {
          console.error(
            "Warning: Could not create default admin:",
            adminError.message
          );
        }
      }
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
