"use strict";

const amqp = require("amqplib");

async function consumerOrderMessage() {
  const connection = await amqp.connect("amqp://user:password@localhost");
  const channel = await connection.createChannel();

  const queueName = "order-queued-message";
  await channel.assertQueue(queueName, {
    durable: true,
  });

  channel.prefetch(1);

  channel.consume(queueName, (msg) => {
    const message = msg.content.toString();

    setTimeout(() => {
      console.log("proccesed", message);
      channel.ack(msg);
    }, Math.random() * 1000);
  });

  setTimeout(() => {
    connection.close();
  }, 10000);
}

consumerOrderMessage().catch((err) =>
  console.log(err, "consumer order message")
);