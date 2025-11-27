import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

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

      const imageUrl = `/uploads/${req.file.filename}`;
      res.json({
        imageUrl,
        message: "Image uploaded successfully",
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  }
);

export default router;
