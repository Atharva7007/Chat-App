const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "chat-app",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "chat-group" });

const run = async () => {
  try {
    console.log("Attempting to connect to kafka...");
    await consumer.connect();
    console.log("Consumer connected!");
    await consumer.subscribe({ topics: ["my-topic"], fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(`Received message: ${message.value.toString()}`);
      },
    });
  } catch (error) {
    console.log("Error: ", error);
  }
};

run();
