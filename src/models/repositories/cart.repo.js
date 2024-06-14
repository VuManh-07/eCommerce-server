"use strict";

const { cart } = require("../../models/cart.model");
const { convertToObjectIdMongodb } = require("../../utils");
const { findProduct } = require("./product.repo");

const findCardById = async (cardId) => {
  return await cart
    .findOne({
      _id: convertToObjectIdMongodb(cardId),
      cart_state: "active",
    })
    .lean();
};

module.exports = {
  findCardById,
};
