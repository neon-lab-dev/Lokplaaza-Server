import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import fs from "fs";

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
}

export const sendVideoToCloudinary = (
  originalName: string,
  localPath: string
): Promise<CloudinaryResponse> => {
  return new Promise((resolve, reject) => {
    const publicId = originalName.split(".")[0] + "-" + Date.now();

    cloudinary.uploader.upload(
      localPath,
      { resource_type: "video", public_id: publicId },
      (error, result: UploadApiResponse | undefined) => {
        // Delete local file
        fs.unlink(localPath, (err) => {
          if (err) console.error("Failed to delete local file:", err);
        });

        if (error) return reject(error);

        if (result && result.secure_url && result.public_id) {
          resolve({ secure_url: result.secure_url, public_id: result.public_id });
        } else {
          reject(new Error("Failed to upload video to Cloudinary"));
        }
      }
    );
  });
};
