"use strict";

const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "cart";
const COLLECTION_NAME = "carts";

// Declare the Schema of the Mongo model
const cartSchema = new mongoose.Schema(
  {
    cart_state: {
      type: String,
      required: true,
      enum: ["active", "completed", "failed", "pending"],
    },
    cart_products: { type: Array, default: [] },
    /* */
    cart_count_product: { type: Number, default: 0 },
    cart_userId: { type: String, required: true },
  },
  {
    collections: COLLECTION_NAME,
    timestamps: { createdAt: "createdOn", updatedAt: "modifiedOn" },
  }
);

//Export the model
module.exports = {
  cart: mongoose.model(DOCUMENT_NAME, cartSchema),
};
