const amqp = require("amqplib");

const runConsumer = async () => {
  try {
    const connection = await amqp.connect("amqp://user:password@localhost");
    const channel = await connection.createChannel();

    const queueName = "test-topic";
    await channel.assertQueue(queueName, {
      durable: true,
    });

    channel.consume(
      queueName,
      (message) => {
        console.log(`Received:: ${message.content.toString()}`);
      },
      {
        noAck: false,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

runConsumer();
