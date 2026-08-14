const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://studentportal-one-wheat.vercel.app"
    ],
    credentials: true
  })
);

// Routes
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/course");
const adminRoutes = require("./routes/admin");

app.use("/auth", authRoutes);
app.use("/courses", courseRoutes);
app.use("/admin", adminRoutes);

// Home
app.get("/", (req, res) => {
  res.json({
    message: "Student Portal API is running",
    status: "OK"
  });
});

// Auth test
app.get("/auth/test", (req, res) => {
  res.json({
    message: "Auth route is working"
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    method: req.method
  });
});

// MongoDB
mongoose
  .connect(process.env.DB_STRING, {
    dbName: "studentPortal"
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});