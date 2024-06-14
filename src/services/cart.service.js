"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const { findProduct } = require("../models/repositories/product.repo");
const { cart } = require("../models/cart.model");
const { convertToObjectIdMongodb } = require("../utils");

/* 
  key featurea: Cart Service
  - add product to cart [user]
  - reduce product quantity by one [User]
  - increase product quantity by ine [User]
  -get cart [User]
  - delete cart [User]
  - delete cart item [User]
*/

class CartService {
  static async createUserCart({ userId, product }) {
    const query = { cart_userId: userId, cart_state: "active" },
      updateOrInsert = {
        $addToSet: { cart_products: product },
      },
      options = { upsert: true, new: true };

    return await cart.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product;
    console.log(productId, quantity, userId);
    const query = {
        cart_userId: userId,
        "cart_products.productId": productId,
        cart_state: "active",
      },
      updateSet = {
        $inc: { "cart_products.$.quantity": quantity },
      },
      options = { upsert: true, new: true };
    console.log("updateee...");

    return await cart.findOneAndUpdate(query, updateSet, options);
  }

  static async addToCart({ userId, product = {} }) {
    //check cart exists?
    const userCart = await cart.findOne({ cart_userId: userId });
    if (!userCart) {
      //create new cart
      return await CartService.createUserCart({
        userId,
        product,
      });
    }

    //neu co cart roi nhung chua co sp?
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    //neu sp da ton tai trong cart => update quantity
    return await CartService.updateUserCartQuantity({ userId, product });
  }

  //update in cart
  /**
    shop_order_ids: [
       {
          shopId,
          item_products: [
            {
               quantity,
               price,
               shopId,
               old_quantity,
               productId
            }
          ]
        }
    ]
   
   */
  static async addToInCart({ userId, shop_order_ids }) {
    console.log({ userId, shop_order_ids });
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];

    const foundProduct = await findProduct({
      product_id: convertToObjectIdMongodb(productId),
      unSelect: ["_v"],
    });
    console.log(foundProduct, "foundProduct");
    if (!foundProduct) throw new NotFoundError("Not Found Product");

    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId)
      throw new NotFoundError("Product do not belong to the shop");

    if (quantity === 0) {
      return await deleteUserCart({ userId, productId });
    }

    return await CartService.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  static async deleteUserItemInCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: "active" },
      updateSet = {
        $pull: { cart_products: { productId } },
      };

    const deleteCart = await cart.updateOne(query, updateSet);
    return deleteCart;
  }

  static async getListUserCart({ userId }) {
    return await cart.findOne({ cart_userId: userId }).lean();
  }
}

module.exports = CartService;
