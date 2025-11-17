import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";
import multer from "multer";

// Video storage on Cloudinary
const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: () => ({
    folder: "course_videos",
    resource_type: "video",
  }),
});

export const multerVideoUpload = multer({
  storage: videoStorage,
  limits: { fileSize: 500 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = file.originalname.split(".").pop()?.toLowerCase();
    if (["mp4", "mov", "avi", "mkv"].includes(ext!)) cb(null, true);
    else cb(new Error("Only video files are allowed"));
  },
});
