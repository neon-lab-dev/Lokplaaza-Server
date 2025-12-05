"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromS3 = exports.uploadToS3 = void 0;
// services/s3UploadService.ts
const config_1 = __importDefault(require("../config"));
const s3Config_1 = __importStar(require("../config/s3Config"));
const fs_1 = __importDefault(require("fs"));
/**
 * Upload file to AWS S3
 */
// services/s3UploadService.ts
const uploadToS3 = (file_1, ...args_1) => __awaiter(void 0, [file_1, ...args_1], void 0, function* (file, folder = 'glb-files') {
    const fileStream = fs_1.default.createReadStream(file.path);
    const timestamp = Date.now();
    const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '-');
    const key = `${folder}/${timestamp}-${sanitizedFileName}`;
    // Ensure bucket name is configured
    if (!s3Config_1.awsConfig.bucketName) {
        throw new Error('S3 bucket name is not configured in awsConfig.bucketName');
    }
    const uploadParams = {
        Bucket: s3Config_1.awsConfig.bucketName,
        Key: key,
        Body: fileStream,
        ContentType: file.mimetype,
        // REMOVE THIS LINE: ACL: 'public-read',
        // Add this instead for public access through bucket policy
        // No ACL needed when bucket has "Bucket owner enforced"
    };
    try {
        const uploadResult = yield s3Config_1.default.upload(uploadParams).promise();
        // Delete local file
        fs_1.default.unlinkSync(file.path);
        return {
            url: `https://${s3Config_1.awsConfig.bucketName}.s3.${config_1.default.awsRegion}.amazonaws.com/${key}`,
            key: uploadResult.Key,
            bucket: uploadResult.Bucket,
        };
    }
    catch (error) {
        if (fs_1.default.existsSync(file.path)) {
            fs_1.default.unlinkSync(file.path);
        }
        throw error;
    }
});
exports.uploadToS3 = uploadToS3;
/**
 * Delete file from S3
 */
const deleteFromS3 = (key) => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure bucket name is configured
    if (!s3Config_1.awsConfig.bucketName) {
        throw new Error('S3 bucket name is not configured in awsConfig.bucketName');
    }
    const deleteParams = {
        Bucket: s3Config_1.awsConfig.bucketName,
        Key: key,
    };
    yield s3Config_1.default.deleteObject(deleteParams).promise();
});
exports.deleteFromS3 = deleteFromS3;
