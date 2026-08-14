import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://student-portal-backend-401n.onrender.com/auth/login",
        {
          email,
          password
        }
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "role",
        res.data.role
      );

      alert("Login successful!");

      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.error("Login error:", error);

      alert(
        error.response?.data?.error ||
        "Login failed. Please check your email and password."
      );
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>

        <h1 style={headingStyle}>
          Student Portal
        </h1>

        <h2 style={subHeadingStyle}>
          Login
        </h2>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            style={inputStyle}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={inputStyle}
            required
          />

          <button
            type="submit"
            style={buttonStyle}
          >
            Login
          </button>

        </form>

        <p style={textStyle}>
          New student?
        </p>

        <button
          onClick={() => navigate("/register")}
          style={secondaryButton}
        >
          Create Student Account
        </button>

      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background:
    "linear-gradient(135deg, #0f172a, #1e293b)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px"
};

const cardStyle = {
  width: "400px",
  background: "#1e293b",
  padding: "35px",
  borderRadius: "18px",
  border: "1px solid #475569",
  boxShadow: "0 10px 40px rgba(0,0,0,0.4)"
};

const headingStyle = {
  color: "#ffffff",
  textAlign: "center",
  marginBottom: "10px"
};

const subHeadingStyle = {
  color: "#cbd5e1",
  textAlign: "center",
  marginBottom: "25px"
};

const textStyle = {
  color: "#cbd5e1",
  textAlign: "center",
  marginTop: "25px",
  marginBottom: "10px"
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "14px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #64748b",
  background: "#0f172a",
  color: "#ffffff",
  fontSize: "15px"
};

const buttonStyle = {
  width: "100%",
  padding: "14px",
  border: "none",
  borderRadius: "8px",
  background: "#2563eb",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer"
};

const secondaryButton = {
  width: "100%",
  padding: "13px",
  borderRadius: "8px",
  border: "1px solid #64748b",
  background: "transparent",
  color: "#ffffff",
  fontSize: "15px",
  cursor: "pointer"
};

export default Login;