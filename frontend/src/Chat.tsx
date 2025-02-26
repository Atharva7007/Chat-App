import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

interface Message {
  content: string;
  user: string;
}

interface ChatProps {
  username: string; // Receive the username as a prop
}

const socket: Socket = io("http://localhost:3000");

const Chat: React.FC<ChatProps> = ({ username }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  useEffect(() => {
    socket.on("message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    if (newMessage) {
      socket.emit("message", { user: username, content: newMessage });
      setNewMessage("");
    }
  };

  return (
    <div>
      <h1>Real-Time Chat</h1>
      <div>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>
              <strong>{msg.user}: </strong>
              {msg.content}
            </li>
          ))}
        </ul>
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type your message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
