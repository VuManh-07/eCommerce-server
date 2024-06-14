"use strict";

const inventory = require("../inventory.model");
const { Types } = require("mongoose");

const { convertToObjectIdMongodb } = require("../../utils");

const insertInventory = async ({ productId, shopId, stock, location }) => {
  return await inventory.create({
    inven_productId: productId,
    inven_stock: stock,
    inven_location: location,
    inven_shopId: shopId,
  });
};

const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
      inven_productId: convertToObjectIdMongodb(productId),
      inven_stock: { $gte: quantity },
    },
    updateSet = {
      $inc: {
        inven_stock: -quantity,
      },
      $push: {
        inven_reservations: {
          quantity,
          cartId,
          createOne: new Date(),
        },
      },
    },
    options = { upset: true, new: true };

  return await inventory.updateOne(query, update, options);
};

module.exports = {
  insertInventory,
  reservationInventory,
};
