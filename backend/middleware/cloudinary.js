import { v2 as cloudinary } from "cloudinary";
import multerStorageCloudinary from "multer-storage-cloudinary";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";

const { CloudinaryStorage } = multerStorageCloudinary;

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Validate Cloudinary configuration
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  if (process.env.NODE_ENV === "development") {
    console.warn(
      "⚠️  Cloudinary credentials not found. Image uploads will fail."
    );
    console.warn(
      "   Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env"
    );
  }
}

// Create Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "portfolio/projects", // Folder in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [
      {
        width: 1200,
        height: 800,
        crop: "limit", // Maintain aspect ratio, limit dimensions
        quality: "auto", // Auto optimize quality
        fetch_format: "auto", // Auto format (webp when supported)
      },
    ],
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

// Create multer upload instance
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit (Cloudinary free tier allows up to 10MB)
  },
  fileFilter: fileFilter,
});

// Helper function to delete image from Cloudinary
export const deleteImage = async (imageUrl) => {
  try {
    if (!imageUrl) return;

    // Check if it's a Cloudinary URL
    if (!imageUrl.includes("cloudinary.com")) {
      // Not a Cloudinary URL, might be old local file - skip deletion
      return;
    }

    // Extract public_id from Cloudinary URL
    // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{folder}/{public_id}.{ext}
    // or: https://res.cloudinary.com/{cloud_name}/image/upload/{folder}/{public_id}.{ext}
    const urlParts = imageUrl.split("/");
    const uploadIndex = urlParts.findIndex((part) => part === "upload");

    if (uploadIndex === -1) {
      // Not a valid Cloudinary URL
      return;
    }

    // Get everything after /upload/
    const pathAfterUpload = urlParts.slice(uploadIndex + 1).join("/");

    // Remove version prefix if present (v1234567890/)
    const pathWithoutVersion = pathAfterUpload.replace(/^v\d+\//, "");

    // Remove file extension to get public_id
    const publicId = pathWithoutVersion.replace(/\.[^/.]+$/, "");

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (process.env.NODE_ENV === "development") {
      console.log(`Deleted image from Cloudinary: ${publicId}`, result);
    }

    return result;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error deleting image from Cloudinary:", error);
    }
    // Don't throw - allow deletion to continue even if image deletion fails
    return null;
  }
};

export default cloudinary;
