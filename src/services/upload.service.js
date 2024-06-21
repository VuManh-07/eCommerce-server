"use strict";

const crypto = require("crypto");
// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer");
const cloudinary = require("../configs/cloudinary.config");
const {
  s3,
  PutObjectCommand,
  GetObjectCommand,
} = require("../configs/s3.config");

const urlImagePublicS3 = "https://d3bbdzvrchiz3w.cloudfront.net";

const randomImageName = () => crypto.randomBytes(16).toString("hex");

// upload service aws
const uploadImageFromLocalS3 = async ({ file }) => {
  try {
    const imageName = randomImageName();

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageName, // file.originalname || "unknown",
      Body: file.buffer,
      ContentType: "image/jpeg",
    });

    const result = await s3.send(command);

    console.log(result, "upload s3");

    // const signedUrl = new GetObjectCommand({
    //   Bucket: process.env.AWS_BUCKET_NAME,
    //   Key: imageName,
    // });

    // const url = await getSignedUrl(s3, signedUrl, { expiresIn: 3600 });

    return {
      url: `${urlImagePublicS3}/${imageName}`,
      result,
    };
  } catch (error) {
    console.log(error, "upload error s3");
  }
};

const uploadImageFromLocalCloudFont = async ({ file }) => {
  try {
    const imageName = randomImageName();

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageName, // file.originalname || "unknown",
      Body: file.buffer,
      ContentType: "image/jpeg",
    });

    const result = await s3.send(command);

    const url = getSignedUrl({
      url: `${urlImagePublicS3}/${imageName}`,
      keyPairId: "K1TF8ACAMWYXB1",
      dateLessThan: new Date(Date.now() + 1000 * 60),
      privateKey: process.env.AWS_CLOUDFONT_PRIVATE_KEY,
    });

    return {
      url,
      result,
    };
  } catch (error) {
    console.log(error, "upload error s3");
  }
};

// 1 upload image with URL
const uploadImageFromUrl = async (url) => {
  try {
    const urlImage =
      "https://tse1.mm.bing.net/th?id=OIP.avb9nDfw3kq7NOoP0grM4wHaEK&pid=Api";
    const folderName = "product/shopId",
      newFileName = "testdemo";

    const result = await cloudinary.uploader.upload(urlImage, {
      public_id: newFileName,
      folder: folderName,
    });
    console.log(result, "upload img");
    return result;
  } catch (error) {}
};

// 2. Upload from image local
const uploadImageFromLocal = async ({ path, folderName = "product/8409" }) => {
  try {
    const result = await cloudinary.uploader.upload(path, {
      public_id: "thumb",
      folder: folderName,
    });
    console.log(result, "upload img");
    return {
      image_url: result.secure_url,
      shopId: "8049",
      thumb_url: cloudinary.url(result.public_id, {
        headers: 100,
        width: 100,
        format: "jpg",
      }),
    };
  } catch (error) {
    console.log(error, "upload error");
  }
};

module.exports = {
  uploadImageFromUrl,
  uploadImageFromLocal,
  uploadImageFromLocalS3,
  uploadImageFromLocalCloudFont,
};
