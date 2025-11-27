import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { upload } from "../middleware/cloudinary.js";

const router = express.Router();

// Upload project image
router.post(
  "/project-image",
  authenticateToken,
  upload.single("image"),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Cloudinary returns the secure_url in req.file
      const imageUrl = req.file.path || req.file.secure_url || req.file.url;

      if (!imageUrl) {
        return res
          .status(500)
          .json({ error: "Failed to get image URL from Cloudinary" });
      }

      res.json({
        imageUrl,
        message: "Image uploaded successfully to Cloudinary",
      });
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Upload error:", error);
      }
      res.status(500).json({
        error: "Failed to upload image",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
);

export default router;
