import React, { useState } from "react";
import Login from "./Login";
import Chat from "./Chat";

const App: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleLogin = (username: string) => {
    setUsername(username);
    setIsLoggedIn(true);
  };

  return (
    <div>
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Chat username={username} />
      )}
    </div>
  );
};

export default App;
