const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "chat-app",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

const run = async (message) => {
  try {
    await producer.connect();
    await producer.send({
      topic: "my-topic",
      messages: [{ value: message }],
    });
  } catch (error) {
    console.log("Got an error: ", error);
  } finally {
    await producer.disconnect();
  }
};

run();
