"use strict";

const { default: mongoose } = require("mongoose");
const { countConnect } = require("../helpers/check.connect");
const { db } = require("../configs/config.mongodb");

const connectStr = `mongodb://${db.host}:${db.port}/${db.name}`;
console.log(connectStr, "uri");

class Database {
  constructor() {
    this.connect();
  }

  //connect
  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectStr, { maxPoolSize: 50 })
      .then(() => {
        console.log("Connected to MongoDB");
        countConnect();
      })
      .catch((err) => console.log("Failed to connect to MongoDB:", err));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
