import React, { useState } from "react";

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");

  const handleLogin = () => {
    if (username) {
      onLogin(username);
    }
  };

  return (
    <div>
      <label>Username:</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      ></input>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
