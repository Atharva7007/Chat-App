import React, { useState } from "react";
import { useSocket } from "./SocketContext";

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const socket = useSocket(); // Get the socket instance from context

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username) {
      onLogin(username);
      socket.emit("login", { user: username, password: password });
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        ></input>
        <br></br>
        <br></br>
        <label>Passowrd:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <input type="submit" value="Submit"></input>
      </form>
    </div>
  );
};

export default Login;
