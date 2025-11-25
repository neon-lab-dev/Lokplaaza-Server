"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVideoToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const sendVideoToCloudinary = (originalName, localPath) => {
    return new Promise((resolve, reject) => {
        const publicId = originalName.split(".")[0] + "-" + Date.now();
        cloudinary_1.v2.uploader.upload(localPath, { resource_type: "video", public_id: publicId }, (error, result) => {
            // Delete local file
            fs_1.default.unlink(localPath, (err) => {
                if (err)
                    console.error("Failed to delete local file:", err);
            });
            if (error)
                return reject(error);
            if (result && result.secure_url && result.public_id) {
                resolve({ secure_url: result.secure_url, public_id: result.public_id });
            }
            else {
                reject(new Error("Failed to upload video to Cloudinary"));
            }
        });
    });
};
exports.sendVideoToCloudinary = sendVideoToCloudinary;
