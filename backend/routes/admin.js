const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/admin");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ✅ Get all registered students
router.get("/students", adminAuth, async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password");
    if (!students || students.length === 0) {
      return res.status(404).json({ message: "No students found" });
    }
    res.json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ error: "Server error while fetching students" });
  }
});

// ✅ Reset student password
router.post("/set-student-password", adminAuth, async (req, res) => {
  const { studentId, newPassword } = req.body;

  if (!studentId || !newPassword) {
    return res.status(400).json({ error: "Student ID and new password are required" });
  }

  try {
    const hashed = await bcrypt.hash(newPassword, 10);
    const updated = await User.findByIdAndUpdate(studentId, { password: hashed });
    if (!updated) return res.status(404).json({ error: "Student not found" });
    res.json({ message: "Student password updated successfully" });
  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(500).json({ error: "Server error while resetting password" });
  }
});

// ✅ Edit student details (name/email)
router.put("/students/:id", adminAuth, async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  try {
    const updated = await User.findByIdAndUpdate(req.params.id, { name, email });
    if (!updated) return res.status(404).json({ error: "Student not found" });
    res.json({ message: "Student updated successfully" });
  } catch (err) {
    console.error("Error editing student:", err);
    res.status(500).json({ error: "Server error while editing student" });
  }
});

// ✅ Delete student
router.delete("/students/:id", adminAuth, async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Student not found" });
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).json({ error: "Server error while deleting student" });
  }
});

module.exports = router;
