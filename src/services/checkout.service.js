"use strict";

const { BadRequestError } = require("../core/error.response");
const { findCardById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");
const { acquireLock, releaseLock } = require("./redis.service");
const { order } = require("../models/order.model");

/*
{
    cardId,
    userId,
    shop_order_ids: [
        {
            shopId,
            shop_discount: [],
            item_product: [
                {
                    price,
                    quantity,
                    productId
                }
            ],
        }
    ],
}
*/

class CheckoutService {
  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    //check cartId
    const foundCart = await findCardById(cartId);
    if (!foundCart) throw new BadRequestError("Cart does not exist");

    const checkout_order = {
        totalPrice: 0, // tong tien hang
        feeShip: 0, // phi van chuyen
        totalDiscount: 0, // tong tien giam gia
        totalCheckout: 0, // tong thanh toan
      },
      shop_order_ids_new = [];

    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];
      const checkProductServer = await checkProductByServer(item_products);
      console.log(checkProductServer);
      if (!checkProductServer[0]) throw new BadRequestError("Order wrong"); // ?

      //tong tien don hang
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      //tong tien trc khi xu ly
      checkout_order.totalPrice = checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice, // tien trc khi giam gia
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer,
      };

      // neu shop_discounts ton tai > 0, check xem co hop le hay khong
      if (shop_discounts.length > 0) {
        const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
          codeId: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProductServer,
        });

        console.log({ totalPrice, discount });

        //tong cong discount giam gia
        checkout_order.totalDiscount += discount;

        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }

      //TONG THANH TOAN CUOI CUNG
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }

  // order
  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {},
  }) {
    const { shop_order_ids_new, checkout_order } =
      await CheckoutService.checkoutReview({
        cartId,
        userId,
        shop_order_ids,
      });

    //check
    //get new array product
    const products = shop_order_ids_new.flatMap((order) => order.item_products);
    console.log("[1]::" + products);
    const acquireProduct = [];
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
      const keyLock = await acquireLock(productId, quantity, cartId);
      acquireProduct.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    //check if co 1 sp het hang trong kho
    if (acquireProduct.includes(false)) {
      throw new BadRequestError(
        "Some products are expired, please return to cart"
      );
    }

    const newOrder = await order.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: userId,
      order_products: shop_order_ids_new,
    });

    return newOrder;
  }

  /**
   * 1- Query Orders [Users]
   */
  static async getOrdersByUser() {}

  /**
   * 1- Query Orders [Users]
   */
  static async getOneOrdersByUser() {}

  /**
   * 1- Query Orders [Users]
   */
  static async cancelOrdersByUser() {}

  /**
   * 1- Query Orders [Users]
   */
  static async updateOrdersStatusByShop() {}
}

module.exports = CheckoutService;
