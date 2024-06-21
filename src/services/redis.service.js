"use strict";

const redis = require("redis");
const { promisify } = require("util");
const redisClient = redis.createClient({
  url: "redis://redis-12866.c295.ap-southeast-1-1.ec2.redns.redis-cloud.com:12866",
  username: "default",
  password: "tjeQRJRVHFab78Y4QRYyCLhQ57BsH453",
});
const {
  reservationInventory,
} = require("../models/repositories/inventory.repo");

const pexpire = promisify(redisClient.pexpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setnx).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2023_${productId}`;
  const retryTimes = 10;
  const expireTime = 3000;

  for (let i = 0; i < retryTimes; i++) {
    const result = await setnxAsync(key, expireTime);
    if (result === 1) {
      const isReversation = await reservationInventory();
      if (isReversation.modifiedCount) {
        await pexpire(key, expireTime);
        return key;
      }
      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

const releaseLock = async (keyLock) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);
  return await delAsyncKey(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
};
