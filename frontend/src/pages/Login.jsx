import "../index.css";
import axios from "../axiosconfig.js";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function goToHome(e) {
    e.preventDefault();

    try {
      const response = await axios.post('/api/auth/login',
        { username, password }
      );
      const { token, userId } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId); 
      localStorage.setItem('username', username)
      console.log('Token saved:', token);
      console.log('UserId saved:', userId);
      console.log(response.data.message);
      navigate("/home");
    } catch (err) {
      const backendError = err.response?.data?.error || "Login failed";
      setError(backendError);
      console.error("Login Error:", backendError);
    }
  }

  return (
    <>
      
      <div className="registerDiv">
        <h1 className="title">ClimbNote</h1>
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={goToHome}>
          <label>
            Enter Username:
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label>
            {" "}
            Enter Password:
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit">Login</button>
        </form>

        <a className="alternative" href="/signup">
          Sign Up
        </a>
      </div>
    </>
  );
}
export default Login;
