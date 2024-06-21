"use strict";

const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY,
    secretAccessKey: process.env.AWS_BUCKET_SECRET_KEY,
  },
});

module.exports = {
  s3,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
};
