import express from "express";
import { body, param, validationResult } from "express-validator";
import { authenticateToken } from "../middleware/auth.js";
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../utils/database.js";
import { deleteImage } from "../middleware/cloudinary.js";

const router = express.Router();

// Validation middleware
const validateProject = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Title is required and must be less than 200 characters"),
  body("description")
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage(
      "Description is required and must be less than 2000 characters"
    ),
  body("imageUrl")
    .optional()
    .isURL()
    .withMessage("Image URL must be a valid URL"),
  body("liveUrl")
    .optional()
    .isURL()
    .withMessage("Live URL must be a valid URL"),
  body("githubUrl")
    .optional()
    .isURL()
    .withMessage("GitHub URL must be a valid URL"),
  body("technologies")
    .optional()
    .isArray()
    .withMessage("Technologies must be an array"),
];

const validateObjectId = [
  param("id")
    .matches(/^[0-9a-fA-F]{24}$/)
    .withMessage("Invalid project ID format"),
];

// Public route - Get all projects (for portfolio display)
router.get("/", async (req, res) => {
  try {
    const projects = await getAllProjects();
    res.json(projects);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Get projects error:", error);
    }
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// Public route - Get single project
router.get("/:id", validateObjectId, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    const project = await getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Get project error:", error);
    }
    res.status(500).json({ error: "Failed to fetch project" });
  }
});

// Protected routes - require authentication
router.post("/", authenticateToken, validateProject, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors.array(),
      });
    }

    const { title, description, imageUrl, liveUrl, githubUrl, technologies } =
      req.body;

    const project = await createProject({
      title: title.trim(),
      description: description.trim(),
      imageUrl: imageUrl ? imageUrl.trim() : "",
      liveUrl: liveUrl ? liveUrl.trim() : "",
      githubUrl: githubUrl ? githubUrl.trim() : "",
      technologies: Array.isArray(technologies) ? technologies : [],
    });

    res.status(201).json(project);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Create project error:", error);
    }
    res.status(500).json({ error: "Failed to create project" });
  }
});

router.put(
  "/:id",
  authenticateToken,
  validateObjectId,
  validateProject,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Validation failed",
          details: errors.array(),
        });
      }

      const { title, description, imageUrl, liveUrl, githubUrl, technologies } =
        req.body;

      // Get old project to check if image changed
      const oldProject = await getProjectById(req.params.id);

      // If image URL changed and old image exists, delete old image from Cloudinary
      if (
        oldProject &&
        oldProject.imageUrl &&
        oldProject.imageUrl !== imageUrl?.trim()
      ) {
        try {
          await deleteImage(oldProject.imageUrl);
        } catch (imageError) {
          // Log but don't fail the update if image deletion fails
          if (process.env.NODE_ENV === "development") {
            console.warn(
              "Failed to delete old image from Cloudinary:",
              imageError
            );
          }
        }
      }

      const project = await updateProject(req.params.id, {
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl ? imageUrl.trim() : "",
        liveUrl: liveUrl ? liveUrl.trim() : "",
        githubUrl: githubUrl ? githubUrl.trim() : "",
        technologies: Array.isArray(technologies) ? technologies : [],
      });

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      res.json(project);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Update project error:", error);
      }
      res.status(500).json({ error: "Failed to update project" });
    }
  }
);

router.delete("/:id", authenticateToken, validateObjectId, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    // Get project first to get image URL
    const project = await getProjectById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Delete image from Cloudinary if it exists
    if (project.imageUrl) {
      try {
        await deleteImage(project.imageUrl);
      } catch (imageError) {
        // Log but don't fail the deletion if image deletion fails
        if (process.env.NODE_ENV === "development") {
          console.warn("Failed to delete image from Cloudinary:", imageError);
        }
      }
    }

    // Delete project from database
    const deleted = await deleteProject(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Delete project error:", error);
    }
    res.status(500).json({ error: "Failed to delete project" });
  }
});

export default router;
