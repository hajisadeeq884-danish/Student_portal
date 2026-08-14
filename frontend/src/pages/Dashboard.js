import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#111827",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "20px",
        boxSizing: "border-box"
      }}
    >
      <div
        style={{
          width: "700px",
          padding: "50px",
          backgroundColor: "#1f2937",
          borderRadius: "20px",
          border: "1px solid #374151",
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
        }}
      >
        <h1
          style={{
            color: "white",
            fontSize: "48px",
            marginBottom: "15px"
          }}
        >
          Student Dashboard
        </h1>

        <p
          style={{
            color: "#d1d5db",
            fontSize: "20px",
            marginBottom: "40px"
          }}
        >
          Welcome! Here you can view your courses and profile.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "25px",
            flexWrap: "wrap"
          }}
        >
          <button
            onClick={() => navigate("/courses")}
            style={buttonStyle}
          >
            View Courses
          </button>

          <button
            onClick={() => navigate("/student-details")}
            style={buttonStyle}
          >
            Complete Profile
          </button>
        </div>
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: "18px 45px",
  borderRadius: "12px",
  border: "1px solid #4b5563",
  backgroundColor: "#374151",
  color: "white",
  fontSize: "20px",
  fontWeight: "bold",
  cursor: "pointer",
  minWidth: "220px"
};

export default Dashboard;