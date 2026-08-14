import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function StudentDetails() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [college, setCollege] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    console.log("TOKEN:", token);

    if (!token) {
      alert("Login session not found. Please login again.");
      navigate("/");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.put(
        "https://student-portal-backend-401n.onrender.com/auth/me",
        {
          phone,
          dateOfBirth,
          gender,
          address,
          department,
          semester,
          rollNumber,
          college
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("SUCCESS:", res.data);

      alert(
        res.data.message ||
        "Details submitted successfully!"
      );

      navigate("/dashboard");

    } catch (error) {
      console.error("FULL ERROR:", error);

      console.log(
        "STATUS:",
        error.response?.status
      );

      console.log(
        "SERVER RESPONSE:",
        error.response?.data
      );

      alert(
        `Error ${error.response?.status || ""}: ${
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Failed to submit details."
        }`
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>

        <h1 style={headingStyle}>
          Student Details
        </h1>

        <p style={subHeadingStyle}>
          Complete your profile for admin approval
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={inputStyle}
            required
          />

          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            style={inputStyle}
            required
          />

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            style={inputStyle}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={inputStyle}
            required
          />

          <input
            type="text"
            placeholder="Department (e.g. CSE)"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            style={inputStyle}
            required
          />

          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            style={inputStyle}
            required
          >
            <option value="">Select Semester</option>
            <option value="1st">1st Semester</option>
            <option value="2nd">2nd Semester</option>
            <option value="3rd">3rd Semester</option>
            <option value="4th">4th Semester</option>
            <option value="5th">5th Semester</option>
            <option value="6th">6th Semester</option>
            <option value="7th">7th Semester</option>
            <option value="8th">8th Semester</option>
          </select>

          <input
            type="text"
            placeholder="Roll Number"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            style={inputStyle}
            required
          />

          <input
            type="text"
            placeholder="College / University"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            style={inputStyle}
            required
          />

          <button
            type="submit"
            style={buttonStyle}
            disabled={loading}
          >
            {loading
              ? "Submitting..."
              : "Submit for Admin Approval"}
          </button>

        </form>

      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #0f172a, #1e293b)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "30px"
};

const cardStyle = {
  width: "500px",
  padding: "35px",
  backgroundColor: "#1e293b",
  borderRadius: "18px",
  border: "1px solid #475569",
  boxShadow: "0 10px 40px rgba(0,0,0,0.4)"
};

const headingStyle = {
  color: "white",
  textAlign: "center"
};

const subHeadingStyle = {
  color: "#cbd5e1",
  textAlign: "center",
  marginBottom: "25px"
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #64748b",
  backgroundColor: "#0f172a",
  color: "white",
  fontSize: "16px"
};

const buttonStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "10px",
  border: "none",
  borderRadius: "8px",
  backgroundColor: "#2563eb",
  color: "white",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer"
};

export default StudentDetails;