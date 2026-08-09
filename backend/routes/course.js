const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const User = require("../models/User");
const adminAuth = require("../middleware/admin");

// ✅ Get all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ error: "Server error while fetching courses" });
  }
});

// ✅ Add course (Admin only)
router.post("/add", adminAuth, async (req, res) => {
  const { title, description, instructor } = req.body;

  if (!title || !description || !instructor) {
    return res.status(400).json({ error: "Title, description, and instructor are required" });
  }

  try {
    const course = new Course({ title, description, instructor });
    await course.save();
    res.json({ message: "Course added successfully", course });
  } catch (err) {
    console.error("Error adding course:", err);
    res.status(500).json({ error: "Server error while adding course" });
  }
});

// ✅ Enroll student
router.post("/:id/enroll", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Prevent duplicate enrollment
    if (!course.studentsEnrolled.includes(user._id)) {
      course.studentsEnrolled.push(user._id);
    }
    if (!user.enrolledCourses.includes(course._id)) {
      user.enrolledCourses.push(course._id);
    }

    await course.save();
    await user.save();

    res.json({ message: "Student enrolled successfully" });
  } catch (err) {
    console.error("Error enrolling student:", err);
    res.status(500).json({ error: "Server error while enrolling student" });
  }
});

module.exports = router;
