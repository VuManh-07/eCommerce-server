require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
const { checkOverload } = require("./helpers/check.connect");
const router = require("./routes");
const app = express();

//init middlewares
app.use(morgan("dev")); // khi dev, combined khi deploy product
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//init db
require("./dbs/init.mongodb");
checkOverload();

//init routes
app.use("/", router);

// handle error
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  return res.status(status).json({
    status: "error",
    code: status,
    message: error.message || "Internal Server Error",
  });
});

module.exports = app;
