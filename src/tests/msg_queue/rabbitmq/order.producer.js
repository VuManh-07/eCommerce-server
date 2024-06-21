"use strict";

const amqp = require("amqplib");

async function consumerOrderMessage() {
  const connection = await amqp.connect("amqp://user:password@localhost");
  const channel = await connection.createChannel();

  const queueName = "order-queued-message";
  await channel.assertQueue(queueName, {
    durable: true,
  });

  for (let i = 0; i < 10; i++) {
    const msg = `order-queued-message ${i}`;
    console.log(`message:: ${msg}`);
    channel.sendToQueue(queueName, Buffer.from(msg), {
      persistent: true,
    });
  }

  setTimeout(() => {
    connection.close();
  }, 1000);
}

consumerOrderMessage().catch((err) =>
  console.log(err, "consumer order message")
);
