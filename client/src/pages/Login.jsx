import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("https://task-maneger-jstp.onrender.com/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (

    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">

      <div className="card shadow-lg p-4 bg-dark text-white" style={{ maxWidth: "400px", width: "100%", borderRadius: "10px" }}>
        <h2 className="text-center mb-4 fw-bold">Welcome Back!</h2>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email Address</label>
          <input
            type="email"
            id="email"
            className="form-control bg-secondary text-white border-0"
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            className="form-control bg-secondary text-white border-0"
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary w-100 fw-semibold mb-3"
          onClick={handleLogin}
        >
          Login
        </button>

        <p className="text-center text-light">
          Don’t have an account?{" "}
          <Link to="/register" className="text-info text-decoration-none">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
