"use strict";

const mongoose = require("mongoose");

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "discounts";

// Declare the Schema of the Mongo model
var discountSchema = new mongoose.Schema(
  {
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: { type: String, default: "fixed_amount" }, // percentage
    discount_value: { type: Number, required: true }, //
    discount_code: { type: String, required: true },
    discount_start_date: { type: Date, required: true },
    discount_end_date: { type: Date, required: true },
    discount_max_uses: { type: Number, required: true }, // so luong discount duoc ap dung toi da bao nhieu
    discount_uses_count: { type: Number, required: true }, // so luong da duoc su dung
    discount_users_used: { type: Array, default: [] }, // nhung user da su dung
    discount_max_uses_per_user: { type: Number, required: true }, // discount max ma user co the ap dung
    discount_min_order_value: { type: Number, required: true },
    discount_shopId: { type: mongoose.Types.ObjectId, ref: "Shop" },

    discount_is_active: { type: Boolean, default: true },
    discount_applies_to: {
      type: String,
      required: true,
      enum: ["all", "specific"],
    },
    discount_product_ids: { type: Array, default: [] }, // so san pham duoc ap dung voi specific
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, discountSchema);
