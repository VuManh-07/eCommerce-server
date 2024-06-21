"use strict";

const {
  uploadImageFromUrl,
  uploadImageFromLocal,
  uploadImageFromLocalS3,
  uploadImageFromLocalCloudFont,
} = require("../services/upload.service");
const { SuccessResponse } = require("../core/success.response");
const { BadRequestError } = require("../core/error.response");

class UploadController {
  uploadFile = async (req, res, next) => {
    new SuccessResponse({
      message: "upload File success",
      metadata: await uploadImageFromUrl(req.body),
    }).send(res);
  };

  uploadFileThumb = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestError("File missing");
    }
    new SuccessResponse({
      message: "upload File success",
      metadata: await uploadImageFromLocal({ path: file.path }),
    }).send(res);
  };

  uploadFileLocalS3 = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestError("File missing");
    }
    new SuccessResponse({
      message: "upload File success",
      metadata: await uploadImageFromLocalS3({ file }),
    }).send(res);
  };

  uploadFileLocalCloudFont = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestError("File missing");
    }
    new SuccessResponse({
      message: "upload File success",
      metadata: await uploadImageFromLocalCloudFont({ file }),
    }).send(res);
  };
}

module.exports = new UploadController();
