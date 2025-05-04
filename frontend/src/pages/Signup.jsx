import "./register.css"
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosconfig.js";
import { useState, useEffect } from "react";

function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  async function goToHome(e) {
    e.preventDefault();

    if (username.length < 8) {
      setError("Username must be at least 8 characters");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setError("");

    try {
      const response = await axios.post('/api/auth/signup',
        { username, password, email }
      );
      const { token, userId } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId); 
      localStorage.setItem('username', username);
      console.log('Token saved:', token);
      console.log('UserId saved:', userId);

      console.log(response.data.message);
      navigate("/home");
    } catch (err) {
      const backendError = err.response?.data?.error || "Signup failed";
      setError(backendError);
      console.error("Signup Error:", backendError);
    }
  }

  return (
    <>
      <div className="registerDiv">
      <h1 className="title">ClimbNote</h1>
        <h2>Sign Up</h2>

        {error && <p className="error">{error}</p>}
        <form onSubmit={goToHome}>
          <label>
            Enter Email:
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Enter Username:
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
            />
          </label>
          <label>
            Enter Password:
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit">Sign Up!</button>
        </form>
        <a className="alternative" href="/login">
          Log in
        </a>
      </div>
    </>
  );
}

export default Signup;
