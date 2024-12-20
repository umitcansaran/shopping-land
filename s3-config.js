const AWS = require('aws-sdk');
require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Your AWS Access Key ID
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Your AWS Secret Access Key
  region: process.env.AWS_REGION, // Your AWS Region
});

module.exports = s3;
