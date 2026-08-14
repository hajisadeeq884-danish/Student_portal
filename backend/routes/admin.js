const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Notification = require("../models/Notification");
const adminAuth = require("../middleware/admin");

// =====================================
// GET ALL PENDING STUDENTS
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

    // Update approval status
    student.approvalStatus = "approved";

    await student.save();


    // =====================================
    // CREATE APPROVAL NOTIFICATION
    // =====================================

    await Notification.create({
      user: student._id,

      title: "Account Approved",

      message:
        "Congratulations! Your student account has been approved by the administrator.",

      type: "success",

      isRead: false
    });


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

    // Update approval status
    student.approvalStatus = "rejected";

    await student.save();


    // =====================================
    // CREATE REJECTION NOTIFICATION
    // =====================================

    await Notification.create({
      user: student._id,

      title: "Application Rejected",

      message:
        "Your student application has been rejected by the administrator.",

      type: "error",

      isRead: false
    });


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

    // Delete notifications of this student
    await Notification.deleteMany({
      user: student._id
    });

    // Delete student
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


module.exports = router;