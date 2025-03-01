const { createServer } = require("http");
const { Server } = require("socket.io");
const { Kafka } = require("kafkajs");
const cors = require("cors"); // Import cors
const db_connection = require("./db");
const mysql = require("mysql");
const { SocketAddress } = require("net");

const kafka = new Kafka({
  clientId: "chat-app",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "chat-group" });
const producer = kafka.producer();

// Kafka consumer logic
const runKafkaConsumer = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topics: ["my-topic"], fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const receivedMessage = JSON.parse(message.value.toString());
        console.log("I AM CONSUMERRRR:", receivedMessage);
        // Emit Kafka message to all connected WebSocket clients
        io.emit("message", receivedMessage);
      },
    });
  } catch (error) {
    console.error("Error in Kafka consumer:", error);
  }
};

// Start the consumer in the background
runKafkaConsumer().catch(console.error);

const runProducer = async (message) => {
  try {
    await producer.connect();
    await producer.send({
      topic: "my-topic",
      messages: [{ value: JSON.stringify(message) }],
    });
    console.log("Sent this message to kafka:", message);
  } catch (error) {
    console.log("Got an error: ", error);
  } finally {
    await producer.disconnect();
  }
};

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

  socket.on("login", (data) => {
    console.log("Data received is: ", data);
    const query = "SELECT user, content FROM messages ORDER BY timestamp asc";
    db_connection.query(query, (error, result, fields) => {
      if (error) {
        console.log("Error while fetching messages: ", error);
        return;
      }
      console.log("Results are: ", result);
      result.forEach((message) => {
        socket.emit("message", message);
      });
    });
  });

  // Listen for incoming "message" event from frontend
  socket.on("message", async (data) => {
    console.log("Received message from frontend:", data); // Log the received message
    const { user, content } = data;
    const query = mysql.format(
      "INSERT INTO messages (user, content) VALUES   (?, ?)",
      [user, content]
    );
    db_connection.query(query, (error, results, fields) => {
      if (error) {
        console.log("Error while inserting into MySQL: ", error);
        return;
      }
      console.log("Successfully inserted messages!");
    });
    await runProducer(data);

    // io.emit("message", { user: data.user, content: data.content });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

httpServer.listen(3000, () => {
  console.log("WebSocket Server listening on http://localhost:3000");
});
