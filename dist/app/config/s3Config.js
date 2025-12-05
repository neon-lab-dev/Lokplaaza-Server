"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.awsConfig = void 0;
// s3Config.ts or in your config file
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const _1 = __importDefault(require("."));
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: _1.default.awsAccessKeyId,
    secretAccessKey: _1.default.awsSecretAccessKey,
    region: _1.default.awsRegion,
});
exports.default = s3;
// Add these to your config
exports.awsConfig = {
    bucketName: _1.default.awsBucketName,
    s3Url: `https://${_1.default.awsBucketName}.s3.${_1.default.awsRegion}.amazonaws.com`,
};
