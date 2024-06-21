"use strict";

const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({
  cloud_name: "dnjeo91pa",
  api_key: "282576339188623",
  api_secret: "BBXyQDAFhcQbMUebI2iqop465kk",
});

module.exports = cloudinary;
