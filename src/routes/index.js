"use strict";

const { apiKey, checkPermission } = require("../auth/checkAuth");
const express = require("express");
const router = express.Router();
const { asyncHandle } = require("../auth/checkAuth");

//check apiKey
router.use(apiKey);

// check permission
router.use(checkPermission("0000"));

router.use("/v1/api/product", require("./product"));
router.use("/v1/api/", require("./access"));

module.exports = router;
