const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Course = require("../models/Course");
const adminAuth = require("../middleware/admin");

// =====================================
// ADMIN HOME
// =====================================
router.get("/", adminAuth, (req, res) => {
  res.json({
    message: "Admin API is working successfully"
  });
});


// =====================================
// GET PENDING STUDENTS
// =====================================
router.get("/pending-students", adminAuth, async (req, res) => {
  try {
    const students = await User.find({
      role: "student",
      approvalStatus: "pending"
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(students);

  } catch (error) {
    console.error("Pending students error:", error);

    res.status(500).json({
      error: "Failed to fetch pending students"
    });
  }
});


// =====================================
// GET ALL STUDENTS
// =====================================
router.get("/students", adminAuth, async (req, res) => {
  try {
    const students = await User.find({
      role: "student"
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(students);

  } catch (error) {
    console.error("Students error:", error);

    res.status(500).json({
      error: "Failed to fetch students"
    });
  }
});


// =====================================
// GET SINGLE STUDENT
// =====================================
router.get("/students/:id", adminAuth, async (req, res) => {
  try {
    const student = await User.findOne({
      _id: req.params.id,
      role: "student"
    })
      .select("-password")
      .populate("enrolledCourses");

    if (!student) {
      return res.status(404).json({
        error: "Student not found"
      });
    }

    res.json(student);

  } catch (error) {
    console.error("Get student error:", error);

    res.status(500).json({
      error: "Failed to fetch student"
    });
  }
});


// =====================================
// APPROVE STUDENT
// =====================================
router.put("/students/:id/approve", adminAuth, async (req, res) => {
  try {
    const student = await User.findOne({
      _id: req.params.id,
      role: "student"
    });

    if (!student) {
      return res.status(404).json({
        error: "Student not found"
      });
    }

    student.approvalStatus = "approved";

    await student.save();

    res.json({
      message: "Student approved successfully",
      student
    });

  } catch (error) {
    console.error("Approve student error:", error);

    res.status(500).json({
      error: "Failed to approve student"
    });
  }
});


// =====================================
// REJECT STUDENT
// =====================================
router.put("/students/:id/reject", adminAuth, async (req, res) => {
  try {
    const student = await User.findOne({
      _id: req.params.id,
      role: "student"
    });

    if (!student) {
      return res.status(404).json({
        error: "Student not found"
      });
    }

    student.approvalStatus = "rejected";

    await student.save();

    res.json({
      message: "Student rejected successfully",
      student
    });

  } catch (error) {
    console.error("Reject student error:", error);

    res.status(500).json({
      error: "Failed to reject student"
    });
  }
});


// =====================================
// EDIT STUDENT
// =====================================
router.put("/students/:id", adminAuth, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      department,
      semester,
      rollNumber,
      college,
      course
    } = req.body;

    const student = await User.findOne({
      _id: req.params.id,
      role: "student"
    });

    if (!student) {
      return res.status(404).json({
        error: "Student not found"
      });
    }

    if (name !== undefined) student.name = name;
    if (email !== undefined) student.email = email;
    if (phone !== undefined) student.phone = phone;
    if (department !== undefined) student.department = department;
    if (semester !== undefined) student.semester = semester;
    if (rollNumber !== undefined) student.rollNumber = rollNumber;
    if (college !== undefined) student.college = college;
    if (course !== undefined) student.course = course;

    await student.save();

    res.json({
      message: "Student updated successfully",
      student
    });

  } catch (error) {
    console.error("Update student error:", error);

    res.status(500).json({
      error: "Failed to update student"
    });
  }
});


// =====================================
// DELETE STUDENT
// =====================================
router.delete("/students/:id", adminAuth, async (req, res) => {
  try {
    const student = await User.findOne({
      _id: req.params.id,
      role: "student"
    });

    if (!student) {
      return res.status(404).json({
        error: "Student not found"
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: "Student deleted successfully"
    });

  } catch (error) {
    console.error("Delete student error:", error);

    res.status(500).json({
      error: "Failed to delete student"
    });
  }
});


// =====================================
// GET ALL COURSES
// =====================================
router.get("/courses", adminAuth, async (req, res) => {
  try {
    const courses = await Course.find().sort({
      createdAt: -1
    });

    res.json(courses);

  } catch (error) {
    console.error("Courses error:", error);

    res.status(500).json({
      error: "Failed to fetch courses"
    });
  }
});


// =====================================
// ADD COURSE
// =====================================
router.post("/courses", adminAuth, async (req, res) => {
  try {
    const {
      title,
      description,
      instructor
    } = req.body;

    if (!title || !description || !instructor) {
      return res.status(400).json({
        error: "Title, description and instructor are required"
      });
    }

    const course = new Course({
      title,
      description,
      instructor
    });

    await course.save();

    res.status(201).json({
      message: "Course added successfully",
      course
    });

  } catch (error) {
    console.error("Add course error:", error);

    res.status(500).json({
      error: "Failed to add course"
    });
  }
});


module.exports = router;