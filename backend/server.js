const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://studentportal-one-wheat.vercel.app",
    ],
    credentials: true,
  })
);

// ==========================================
// ROUTES
// ==========================================

const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/course");
const adminRoutes = require("./routes/admin");

// IMPORTANT:
// File ka actual naam notificationRoutes.js hai
const notificationRoutes = require("./routes/notificationRoutes");

app.use("/auth", authRoutes);
app.use("/courses", courseRoutes);
app.use("/admin", adminRoutes);
app.use("/notifications", notificationRoutes);

// ==========================================
// HOME / API TEST
// ==========================================

app.get("/", (req, res) => {
  res.json({
    message: "Student Portal API is running",
    status: "OK",
  });
});

// ==========================================
// AUTH TEST
// ==========================================

app.get("/auth/test", (req, res) => {
  res.json({
    message: "Auth route is working",
  });
});

// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

// ==========================================
// MONGODB CONNECTION
// ==========================================

if (!process.env.DB_STRING) {
  console.error("ERROR: DB_STRING is missing in environment variables.");
} else {
  mongoose
    .connect(process.env.DB_STRING, {
      dbName: "studentPortal",
    })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
    });
}

// ==========================================
// SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});