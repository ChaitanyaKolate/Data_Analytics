// 📁 frontend/src/pages/Login.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        email,
        password,
        role,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      navigate(res.data.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      alert("Invalid login credentials");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#e8f0fe"
    }}>
      <div style={{
        background: "white",
        padding: 40,
        borderRadius: 10,
        width: 400,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>🔐 Login to Excel Dashboard</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 10, marginBottom: 15, borderRadius: 5, border: "1px solid #ccc" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 10, marginBottom: 15, borderRadius: 5, border: "1px solid #ccc" }}
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ width: "100%", padding: 10, marginBottom: 15, borderRadius: 5, border: "1px solid #ccc" }}
          >
            <option value="user">Login as User</option>
            <option value="admin">Login as Admin</option>
          </select>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: 10,
              background: "#28a745",
              color: "white",
              border: "none",
              borderRadius: 5
            }}
          >
            Login
          </button>
        </form>
        <div style={{ marginTop: 15, textAlign: "center" }}>
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
          <p>
            <Link to="/reset-password" style={{ fontSize: "0.9em" }}>Forgot password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
