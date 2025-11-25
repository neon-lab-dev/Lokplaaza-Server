"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.sendImageToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const config_1 = __importDefault(require("../config"));
// Configuration
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudinary_cloud_name,
    api_key: config_1.default.cloudinary_api_key,
    api_secret: config_1.default.cloudinary_api_secret,
});
const sendImageToCloudinary = (imageName, path) => {
    return new Promise((resolve, reject) => {
        // Upload an image
        cloudinary_1.v2.uploader.upload(path, { public_id: imageName }, function (error, result) {
            if (error) {
                reject(error);
                return;
            }
            // Check if the result is defined
            if (result && result.secure_url) {
                resolve({
                    secure_url: result.secure_url,
                    // You can add other properties from result if needed
                });
            }
            else {
                reject(new Error("Failed to upload image to Cloudinary"));
            }
            // Delete the file after uploading
            fs_1.default.unlink(path, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    console.log("File deleted successfully.");
                }
            });
        });
    });
};
exports.sendImageToCloudinary = sendImageToCloudinary;
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + "/uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix);
    },
});
exports.upload = (0, multer_1.default)({ storage: storage });
