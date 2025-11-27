import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import connectDB from "./config/database.js";
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";
import uploadRoutes from "./routes/upload.js";
import userRoutes from "./routes/user.js";
import contactRoutes from "./routes/contact.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Security Middleware - Helmet (must be first)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false, // Allow images from external sources
  })
);

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(",") // Support multiple origins
    : process.env.NODE_ENV === "production"
    ? false // Deny all in production if not configured
    : "http://localhost:3000", // Allow localhost in development
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Body parser with size limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// MongoDB injection protection
app.use(mongoSanitize());

// General rate limiter for all routes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Strict rate limiter for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: "Too many login attempts, please try again after 15 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Strict rate limiter for contact form
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 contact form submissions per windowMs
  message: "Too many contact requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for upload routes
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 uploads per hour
  message: "Too many upload requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.set("trust proxy", 1);

// Apply general rate limiter to all routes, but skip theme endpoint
app.use("/api/", (req, res, next) => {
  // Skip rate limiting for theme endpoint (public, read-only, frequently accessed)
  if (req.path === "/user/theme" && req.method === "GET") {
    return next();
  }
  // Apply rate limiting for all other routes
  generalLimiter(req, res, next);
});

// Serve uploaded files
app.use("/uploads", express.static(join(__dirname, "uploads")));

// Routes with specific rate limiters
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/upload", uploadLimiter, uploadRoutes);
app.use("/api/user", userRoutes);
app.use("/api/contact", contactLimiter, contactRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  // Log errors properly (in production, use a logging service)
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", err.stack);
  } else {
    // In production, log to a file or logging service
    console.error("Error:", err.message);
  }

  res.status(err.status || 500).json({
    error: "Something went wrong!",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  if (process.env.NODE_ENV === "development") {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});
