"use strict";

const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "../src/uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync("./src/uploads", { recursive: true });
}

const uploadMemory = multer({
  storage: multer.memoryStorage(),
});

const uploadDisk = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./src/uploads/");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  }),
});

module.exports = {
  uploadMemory,
  uploadDisk,
};
