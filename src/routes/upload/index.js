"use strict";

const express = require("express");
const uploadController = require("../../controllers/upload.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication, authenticationV2 } = require("../../auth/authUtils");
const { uploadDisk, uploadMemory } = require("../../configs/multer.config");
const router = express.Router();

//authetication
// router.use(authenticationV2);
//*************************//

router.post("/product", asyncHandler(uploadController.uploadFile));
router.post(
  "/product/thumb",
  uploadDisk.single("file"),
  asyncHandler(uploadController.uploadFileThumb)
);

//upload s3
router.post(
  "/product/bucket",
  uploadMemory.single("file"),
  asyncHandler(uploadController.uploadFileLocalS3)
);
router.post(
  "/product/cloudfont",
  uploadMemory.single("file"),
  asyncHandler(uploadController.uploadFileLocalCloudFont)
);
module.exports = router;
