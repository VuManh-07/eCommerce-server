"use strict";

const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Key";
const COLLECTION_NAME = "Keys";

// Declare the Schema of the Mongo model
var keytokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    privateKey: { type: String, required: true },
    publicKey: { type: String, required: true },
    refreshTokensUsed: { type: Array, default: [] },
    refreshToken: { type: String, required: true },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, keytokenSchema);
