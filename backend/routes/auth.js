const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ===============================
// REGISTER STUDENT
// ===============================
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email and password are required"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,

      // Student automatically
      role: "student",

      // Admin approval required
      approvalStatus: "pending"
    });

    await newUser.save();

    res.status(201).json({
      message:
        "Registration successful. Please complete your student details."
    });

  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      error: "Server error during registration"
    });
  }
});


// ===============================
// LOGIN
// ===============================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    res.json({
      message: "Login successful",
      token,
      role: user.role,
      approvalStatus: user.approvalStatus
    });

  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      error: "Server error during login"
    });
  }
});


// ===============================
// GET CURRENT USER
// ===============================
router.get("/me", async (req, res) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "No token provided"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    res.json(user);

  } catch (error) {
    console.error("Profile error:", error);

    res.status(401).json({
      error: "Invalid or expired token"
    });
  }
});


// ===============================
// UPDATE STUDENT DETAILS
// ===============================
router.put("/me", async (req, res) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "No token provided"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const {
      phone,
      dateOfBirth,
      gender,
      address,
      department,
      semester,
      rollNumber,
      college
    } = req.body;

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    user.phone = phone;
    user.dateOfBirth = dateOfBirth;
    user.gender = gender;
    user.address = address;
    user.department = department;
    user.semester = semester;
    user.rollNumber = rollNumber;
    user.college = college;

    // Details submitted → wait for admin
    user.approvalStatus = "pending";

    await user.save();

    res.json({
      message:
        "Student details submitted successfully. Waiting for admin approval.",
      user
    });

  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      error: "Failed to update student details"
    });
  }
});


module.exports = router;