"use strict";

const mongoose = require("mongoose");

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";

const inventorySchema = new mongoose.Schema(
  {
    inven_productId: { type: mongoose.Types.ObjectId, ref: "Product" },
    inven_location: { type: String, default: "unknown" },
    inven_stock: { type: Number, required: true },
    inven_shopId: { type: mongoose.Types.ObjectId, ref: "Shop" },
    inven_reservations: { type: Array, default: [] },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, inventorySchema);
