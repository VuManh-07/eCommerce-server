"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const discount = require("../models/discount.model");
const {
  findAllDiscountCodesSelect,
  findAllDiscountCodesUnSelect,
  checkDiscountExists,
} = require("../models/repositories/discount.repo");
const { convertToObjectIdMongodb } = require("../utils");
const { findAllProducts } = require("../models/repositories/product.repo");

/*
  Discount Services
  1- Generator Discount Code [Shop | Admin]
  2- Get discount amount [User]
  3- Get all discount codes [User | Shop]
  4- Verify discount code [User]
  5- Delete discount code [Admin  | Shop]
  6- Cancel discount code [User]
*/

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      users_used,
      max_uses_per_user,
    } = payload;

    //check
    if (
      new Date() > new Date(start_date) ||
      new Date(end_date) <= new Date(start_date)
    ) {
      throw new BadRequestError("Discount code has expried!");
    }

    if (new Date(start_date) > new Date(end_date)) {
      throw new BadRequestError("Start date must be before end_date");
    }

    // create index for discount code
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      })
      .lean();

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount exists!");
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_min_order_value: min_order_value ?? 0,
      discount_max_value: max_value,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_shopId: shopId,
      discount_max_uses_per_user: max_uses_per_user,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === "all" ? [] : product_ids,
    });

    return newDiscount;
  }

  static async updateDiscountCode({}) {}

  /* 
    Get all products  available with discount codes
  */

  static async getAllProductWithDiscountCodes({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    //create index for discount_code
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      })
      .lean();

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Discount not exists!");
    }

    console.log(foundDiscount);
    const { discount_applies_to, discount_product_ids } = foundDiscount;

    let products;
    if (discount_applies_to === "all") {
      console.log(11);
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectIdMongodb(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    } else if (discount_applies_to === "specific") {
      console.log(22);
      console.log(page);

      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    return products;
  }

  /*
  Get all discount code of Shop
  */

  static async getAllDiscountCodesByShop({limit, page, shopId}) {
    console.log({limit, page, shopId})
    const discounts = await findAllDiscountCodesSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectIdMongodb(shopId),
        discount_is_active: true,
      },
      select: ["discount_name", "discount_code"],
      model: discount,
    });

    return discounts;
  }

  /*
    apply discount code
  */

  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId),
      },
    });

    if (!foundDiscount) throw new NotFoundError("Discount doesn't exists");

    const {
      discount_is_active,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_min_order_value,
      discount_max_uses_per_user,
      discount_value,
      discount_type,
    } = foundDiscount;

    if (!discount_is_active) throw new NotFoundError("Discount expried!");
    if (!discount_max_uses) throw new NotFoundError("Discount are out!");
    if (
      // new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    )
      throw new NotFoundError("Discount ecode has expried!");

    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      // get total
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(
          "Discount requires a minimum order value of " +
            discount_min_order_value
        );
      }
    }

    // if (discount_max_uses_per_user > 0) {
    //   const useUserDiscount = discount_max_uses_per_user.find(
    //     (user) => user.userId == userId
    //   );
    //   if (useUserDiscount) {
    //     //...
    //   }
    // }

    // check xem discount nay la fixed_amount
    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  static async deteleDiscountCode({ shopId, codeId }) {
    const deleted = await discount.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: convertToObjectIdMongodb(shopId),
    });

    return deleted;
  }

  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId),
      },
    });

    if (!foundDiscount) throw new NotFoundError("Discount doesn't exists");

    const result = await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_users: 1,
        discount_uses_count: -1,
      },
    });

    return result;
  }
}

module.exports = DiscountService;
