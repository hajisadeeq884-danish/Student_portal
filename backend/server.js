const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
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
app.use("/auth", authRoutes);

const courseRoutes = require("./routes/course");
app.use("/courses", courseRoutes);

const adminRoutes = require("./routes/admin");
app.use("/admin", adminRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Student Portal API is running"
  });
});

// MongoDB
mongoose
  .connect(process.env.DB_STRING, {
    dbName: "studentPortal"
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// Render provides PORT through environment variable
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
