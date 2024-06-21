"use strict";

const Notification = require("../models/notification.model");

class NotificationService {
  static async pushNotiToSystem({
    type = "SHOP-001",
    receivedId = 1,
    senderId,
    options = {},
  }) {
    let noti_content;

    if (type === "SHOP-001") {
      noti_content = `vừa mới thêm 1 sản phẩm`;
    } else if (type === "PROMOTION-001") {
      noti_content = `vừa mới thêm 1 voucher`;
    }

    const newNoti = await Notification.create({
      noti_type: type,
      noti_content,
      noti_senderId: senderId,
      noti_receivedId: receivedId,
      noti_options: options,
    });

    return newNoti;
  }

  static async listNotiByUser({ userId = 1, type = "ALL", isRead = 0 }) {
    const match = { noti_receivedId: userId };
    if (type !== "ALL") {
      match["noti_type"] = type;
    }

    return await Notification.aggregate([
      { $match: match },
      {
        $project: {
          noti_type: 1,
          noti_senderId: 1,
          noti_receivedId: 1,
          noti_content: 1,
          noti_options: 1,
          createdAt: 1,
        },
      },
    ]);
  }
}

module.exports = NotificationService;
