const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "chat-app",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

const run = async () => {
  try {
    await producer.connect();
    console.log("Producer connected successfully!");

    await producer.send({
      topic: "my-topic",
      messages: [{ value: "Hi from producer.js" }],
    });
    console.log("Message sent!");
  } catch (error) {
    console.log("Got an error: ", error);
  } finally {
    await producer.disconnect();
  }
};

run();
