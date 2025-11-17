import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import multer from "multer";
import fs from "fs";
import config from "../config";

interface CloudinaryResponse {
  secure_url: string;
  // Add other properties if needed
}

// Configuration
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

export const sendImageToCloudinary = (
  imageName: string,
  path: string
): Promise<CloudinaryResponse> => {
  return new Promise((resolve, reject) => {
    // Upload an image
    cloudinary.uploader.upload(
      path,
      { public_id: imageName },
      function (error, result: UploadApiResponse | undefined) {
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
        } else {
          reject(new Error("Failed to upload image to Cloudinary"));
        }

        // Delete the file after uploading
        fs.unlink(path, (err) => {
          if (err) {
            reject(err);
          } else {
            console.log("File deleted successfully.");
          }
        });
      }
    );
  });
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + "/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
