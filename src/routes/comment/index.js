"use strict";

const express = require("express");
const commentController = require("../../controllers/comment.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication, authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

//authetication
router.use(authenticationV2);
//*************************//

router.post("", asyncHandler(commentController.createComment));
router.get("", asyncHandler(commentController.getComments));
router.delete("", asyncHandler(commentController.deleteComments));

module.exports = router;
