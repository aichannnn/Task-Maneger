import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState(""); // Added username state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username) {
      alert("Please enter username");
      return;
    }

    // Check if email contains "@" and "."
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      alert("Please enter email");
      return;
    } else if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (!password) {
      alert("Please enter password");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        email,
        password,
        username
      });

      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      // Show backend error like "User already exists"
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow-lg p-4 bg-dark text-white"
        style={{ maxWidth: "420px", width: "100%", borderRadius: "12px" }}
      >
        <h2 className="text-center mb-4 fw-bold">Create Your Account</h2>

        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            id="username"
            className="form-control bg-secondary text-white border-0"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email Address</label>
          <input
            type="email"
            id="email"
            className="form-control bg-secondary text-white border-0"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            className="form-control bg-secondary text-white border-0"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="btn btn-danger fw-semibold w-100 mb-3"
          onClick={handleRegister}
        >
          Sign Up
        </button>

        <p className="text-center text-light">
          Already have an account?{" "}
          <Link to="/login" className="text-info text-decoration-none">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;