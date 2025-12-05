// services/s3UploadService.ts
import config from '../config';
import s3, { awsConfig } from '../config/s3Config';
import fs from 'fs';

export interface S3UploadResponse {
  url: string;
  key: string;
  bucket: string;
}

/**
 * Upload file to AWS S3
 */
// services/s3UploadService.ts
export const uploadToS3 = async (
  file: Express.Multer.File,
  folder: string = 'glb-files'
): Promise<S3UploadResponse> => {
  const fileStream = fs.createReadStream(file.path);
  
  const timestamp = Date.now();
  const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '-');
  const key = `${folder}/${timestamp}-${sanitizedFileName}`;

  // Ensure bucket name is configured
  if (!awsConfig.bucketName) {
    throw new Error('S3 bucket name is not configured in awsConfig.bucketName');
  }

  const uploadParams = {
    Bucket: awsConfig.bucketName!,
    Key: key,
    Body: fileStream,
    ContentType: file.mimetype,
    // REMOVE THIS LINE: ACL: 'public-read',
    // Add this instead for public access through bucket policy
    // No ACL needed when bucket has "Bucket owner enforced"
  };

  try {
    const uploadResult = await s3.upload(uploadParams).promise();
    
    // Delete local file
    fs.unlinkSync(file.path);
    
    return {
      url: `https://${awsConfig.bucketName!}.s3.${config.awsRegion}.amazonaws.com/${key}`,
      key: uploadResult.Key,
      bucket: uploadResult.Bucket,
    };
  } catch (error) {
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    throw error;
  }
};

/**
 * Delete file from S3
 */
export const deleteFromS3 = async (key: string): Promise<void> => {
  // Ensure bucket name is configured
  if (!awsConfig.bucketName) {
    throw new Error('S3 bucket name is not configured in awsConfig.bucketName');
  }

  const deleteParams = {
    Bucket: awsConfig.bucketName!,
    Key: key,
  };

  await s3.deleteObject(deleteParams).promise();
};