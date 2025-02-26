const { createServer } = require("http");
const { Server } = require("socket.io");
const { Kafka } = require("kafkajs");
const cors = require("cors"); // Import cors

const kafka = new Kafka({
  clientId: "chat-app",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "chat-group" });

// Kafka consumer logic
const runKafkaConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topics: ["my-topic"], fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      // Emit Kafka message to all connected WebSocket clients
      io.emit("message", message.value.toString());
    },
  });
};

// Start the consumer in the background
runKafkaConsumer().catch(console.error);

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Allow the frontend origin
    methods: ["GET", "POST"],
  },
});

// Handle WebSocket connection
io.on("connection", (socket) => {
  console.log("New client connected!");

  // Listen for incoming "message" event from frontend
  socket.on("message", (data) => {
    console.log("Received message from frontend:", data); // Log the received message
    io.emit("message", { user: data.user, content: data.content });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

httpServer.listen(3000, () => {
  console.log("WebSocket Server listening on http://localhost:3000");
});
