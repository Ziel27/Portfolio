import express from "express";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import { getUserByEmail } from "../utils/database.js";

const router = express.Router();

// Validation middleware for login
const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .trim(),
];

// Login
router.post("/login", validateLogin, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors.array(),
      });
    }

    const { email, password } = req.body;

    const user = await getUserByEmail(email);

    if (!user) {
      // Use generic error message to prevent user enumeration
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      // Use generic error message to prevent user enumeration
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      if (process.env.NODE_ENV === "development") {
        console.error("JWT_SECRET is not set in environment variables");
      }
      return res.status(500).json({ error: "Server configuration error" });
    }

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id.toString(), email: user.email },
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Login error:", error);
    }
    res.status(500).json({ error: "Server error during login" });
  }
});

export default router;
