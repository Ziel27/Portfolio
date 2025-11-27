import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// Get user status and theme
router.get("/status", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({
      availableToWork: user.availableToWork,
      themeMode: user.themeMode || "auto",
    });
  } catch (error) {
    console.error("Get status error:", error);
    res.status(500).json({ error: "Failed to fetch status" });
  }
});

// Get theme (public endpoint)
router.get("/theme", async (req, res) => {
  try {
    const user = await User.findOne({ email: "admin@portfolio.com" });
    if (!user) {
      return res.json({ themeMode: "auto" });
    }
    res.json({ themeMode: user.themeMode || "auto" });
  } catch (error) {
    console.error("Get theme error:", error);
    res.json({ themeMode: "auto" });
  }
});

// Update user status
router.put("/status", authenticateToken, async (req, res) => {
  try {
    const { availableToWork, themeMode } = req.body;

    const updateData = {};
    if (availableToWork !== undefined) {
      updateData.availableToWork = availableToWork;
    }
    if (themeMode !== undefined) {
      updateData.themeMode = themeMode;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      availableToWork: user.availableToWork,
      themeMode: user.themeMode,
      message: "Status updated successfully",
    });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ error: "Failed to update status" });
  }
});

export default router;
