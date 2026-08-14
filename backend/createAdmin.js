const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DB_STRING, {
      dbName: "studentPortal"
    });

    console.log("✅ Connected to MongoDB");

    // Admin login details
    const adminEmail = "admin@studentportal.com";
    const adminPassword = "Admin@12345";

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      email: adminEmail
    });

    if (existingAdmin) {
      console.log("⚠️ Admin account already exists.");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      adminPassword,
      10
    );

    // Create admin
    const admin = new User({
      name: "Portal Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      approvalStatus: "approved"
    });

    await admin.save();

    console.log("");
    console.log("=================================");
    console.log("✅ ADMIN CREATED SUCCESSFULLY");
    console.log("=================================");
    console.log("Email    :", adminEmail);
    console.log("Password :", adminPassword);
    console.log("=================================");

    process.exit(0);

  } catch (error) {
    console.error("❌ Admin creation error:", error);
    process.exit(1);
  }
}

createAdmin();