import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const res = await axios.post(
        "https://student-portal-backend-401n.onrender.com/auth/register",
        {
          name,
          email,
          password,
          role: "student"
        }
      );

      alert(res.data.message || "Registration successful!");

      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);

      alert(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Registration failed. Please try again."
      );
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={headingStyle}>Student Registration</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button onClick={handleRegister} style={buttonStyle}>
          Register
        </button>

        <p style={textStyle}>Already have an account?</p>

        <Link to="/" style={linkStyle}>
          Back to Login
        </Link>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  backgroundColor: "#111827",
  color: "white",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  boxSizing: "border-box"
};

const cardStyle = {
  width: "380px",
  padding: "35px",
  backgroundColor: "#1f2937",
  borderRadius: "15px",
  border: "1px solid #374151",
  textAlign: "center"
};

const headingStyle = {
  color: "white",
  fontSize: "30px",
  marginBottom: "25px"
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #4b5563",
  backgroundColor: "#111827",
  color: "white",
  fontSize: "16px"
};

const buttonStyle = {
  width: "100%",
  padding: "13px",
  border: "none",
  borderRadius: "8px",
  backgroundColor: "#2563eb",
  color: "white",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer"
};

const textStyle = {
  color: "#d1d5db",
  marginTop: "25px"
};

const linkStyle = {
  color: "#60a5fa",
  textDecoration: "none",
  fontWeight: "bold"
};

export default Register;