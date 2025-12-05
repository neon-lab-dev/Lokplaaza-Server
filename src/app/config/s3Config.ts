// s3Config.ts or in your config file
import AWS from 'aws-sdk';
import config from '.';

const s3 = new AWS.S3({
  accessKeyId: config.awsAccessKeyId,
  secretAccessKey: config.awsSecretAccessKey,
  region: config.awsRegion,
});

export default s3;

// Add these to your config
export const awsConfig = {
  bucketName: config.awsBucketName,
  s3Url: `https://${config.awsBucketName}.s3.${config.awsRegion}.amazonaws.com`,
};