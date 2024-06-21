"use strict";

const { model, Types, Schema } = require("mongoose");

const DOCCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

const orderSchema = new Schema(
  {
    order_userId: { type: Number },
    order_checkout: { type: String, default: {} },
    order_shipping: { type: Object, default: {} },
    order_payment: { type: Object, default: {} },
    order_products: { type: Array, required: true },
    order_trackingNumber: { type: Number, default: "#0000118052022" },
    order_status: {
      type: String,
      enum: ["pending", "comfirm", "shipped", "cancelled", "delivered"],
      default: "pending",
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: {
      createdAt: "createdOn",
      updatedAt: "modifiedOn",
    },
  }
);

module.exports = {
  order: model(DOCCUMENT_NAME, orderSchema),
};
