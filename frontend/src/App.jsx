import { useState, useEffect } from "react";
import Login from "./pages/Login";

function App() {
  const [token, setToken] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return token ? (
    <Notes token={token} onLogout={handleLogout}/>
  ) : (
    <Login onLogin={handleLogin}/>
  );
}

export default App
