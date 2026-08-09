const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Serve static frontend files
app.use(express.static(path.join(__dirname, "../frontend/static")));

// ✅ Routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const courseRoutes = require("./routes/course");
app.use("/courses", courseRoutes);

const adminRoutes = require("./routes/admin");
app.use("/admin", adminRoutes);

// ✅ Root route — show Student Portal homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/static/index.html"));
});

// ✅ Connect MongoDB
mongoose.connect(process.env.DB_STRING, { dbName: "studentPortal" })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Start server
app.listen(5000, () => console.log("🚀 Server running on port 5000"));

