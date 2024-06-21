const Redis = require("redis");

class RedisPubSubService {
  constructor() {
    this.publisher = Redis.createClient({
      url: "redis://redis-12866.c295.ap-southeast-1-1.ec2.redns.redis-cloud.com:12866",
      username: "default",
      password: "tjeQRJRVHFab78Y4QRYyCLhQ57BsH453",
    });
    this.subscriber = Redis.createClient({
      url: "redis://redis-12866.c295.ap-southeast-1-1.ec2.redns.redis-cloud.com:12866",
      username: "default",
      password: "tjeQRJRVHFab78Y4QRYyCLhQ57BsH453",
    });
  }

  async publish(channel, message) {
    return new Promise((resolve, reject) => {
      this.publisher.publish(channel, message, (err, reply) => {
        if (err) {
          return reject(new Error(err));
        } else {
          resolve(reply);
        }
      });
    });
  }

  async subscribe(channel, callback) {
    // await this.subscriber.connect();
    this.subscriber.subscribe(channel);
    this.subscriber.on("message", (subChannel, message) => {
      console.log("test::1");
      if (subChannel === channel) callback(channel, message);
    });
  }
}

module.exports = new RedisPubSubService();
