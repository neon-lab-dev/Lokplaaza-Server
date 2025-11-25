"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerVideoUpload = void 0;
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_config_1 = require("./cloudinary.config");
const multer_1 = __importDefault(require("multer"));
// Video storage on Cloudinary
const videoStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_config_1.cloudinaryUpload,
    params: () => ({
        folder: "course_videos",
        resource_type: "video",
    }),
});
exports.multerVideoUpload = (0, multer_1.default)({
    storage: videoStorage,
    limits: { fileSize: 500 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        var _a;
        const ext = (_a = file.originalname.split(".").pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        if (["mp4", "mov", "avi", "mkv"].includes(ext))
            cb(null, true);
        else
            cb(new Error("Only video files are allowed"));
    },
});
