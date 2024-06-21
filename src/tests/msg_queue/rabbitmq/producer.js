const amqp = require("amqplib");
const msg = "helle .....";

const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://user:password@localhost");
    const channel = await connection.createChannel();

    const queueName = "test-topic";
    await channel.assertQueue(queueName, {
      durable: true,
    });

    channel.sendToQueue(queueName, Buffer.from(msg));
    console.log(`msg sent::`, msg);
  } catch (error) {
    console.log(error);
  }
};

runProducer();
