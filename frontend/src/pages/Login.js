import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "https://student-portal-backend-401n.onrender.com/auth/login",
        {
          email,
          password
        }
      );

      // Save login information
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      alert("Login successful!");

      // Admin → Admin Dashboard
      if (res.data.role === "admin") {
        navigate("/admin");
        return;
      }

      // Student → Check approval status
      if (res.data.role === "student") {

        if (res.data.approvalStatus === "pending") {
          navigate("/student-details");
          return;
        }

        if (res.data.approvalStatus === "rejected") {
          alert(
            "Your registration has been rejected by the admin."
          );
          return;
        }

        if (res.data.approvalStatus === "approved") {
          navigate("/dashboard");
          return;
        }

        // Fallback
        navigate("/student-details");
      }

    } catch (error) {
      console.error("Login error:", error);

      alert(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>

        <h1 style={headingStyle}>
          Student Portal
        </h1>

        <h2 style={subHeadingStyle}>
          Student Login
        </h2>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Student Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />

          <button
            type="submit"
            style={buttonStyle}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
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

        <button
          onClick={() => navigate("/admin-login")}
          style={adminButton}
        >
          Admin Login
        </button>

      </div>
    </div>
  );
}


// ===============================
// STYLES
// ===============================

const pageStyle = {
  minHeight: "100vh",
  background:
    "linear-gradient(135deg, #0f172a, #1e293b)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  boxSizing: "border-box"
};

const cardStyle = {
  width: "100%",
  maxWidth: "400px",
  background: "#1e293b",
  padding: "35px",
  borderRadius: "18px",
  border: "1px solid #475569",
  boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
  boxSizing: "border-box"
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
  cursor: "pointer",
  marginBottom: "12px"
};

const adminButton = {
  width: "100%",
  padding: "13px",
  borderRadius: "8px",
  border: "none",
  background: "#374151",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: "bold",
  cursor: "pointer"
};

export default Login;