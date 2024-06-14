"use strict";

const inventory = require("../models/inventory.model");
const { findProduct } = require("../models/repositories/product.repo");
const { BadRequestError } = require("../core/error.response");

class InventoryService {
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location = "Dong Da ,Ha Noi",
  }) {
    const foundProduct = await findProduct(productId);
    if (!foundProduct) throw new BadRequestError("The product does not exists");

    const query = { inven_shopId: shopId, inven_productId: productId },
      updateSet = {
        $inc: {
          inven_stock: stock,
        },
        $set: {
          inven_location: location,
        },
      },
      options = { upsert: true, new: true };

    return await inventory.findOneAndUpdate(query, updateSet, options);
  }
}

module.exports = InventoryService;
