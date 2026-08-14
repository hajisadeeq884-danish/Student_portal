const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const Notification = require("../models/Notification");

// =====================================
// AUTHENTICATE USER
// =====================================

const authenticateUser = (req, res, next) => {
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

    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      error: "Invalid or expired token"
    });
  }
};


// =====================================
// GET STUDENT NOTIFICATIONS
// =====================================

router.get("/", authenticateUser, async (req, res) => {
  try {

    const notifications = await Notification.find({
      user: req.user.id
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);

  } catch (error) {

    console.error("Notification fetch error:", error);

    res.status(500).json({
      error: "Failed to fetch notifications"
    });
  }
});


// =====================================
// GET UNREAD COUNT
// =====================================

router.get("/unread-count", authenticateUser, async (req, res) => {
  try {

    const count = await Notification.countDocuments({
      user: req.user.id,
      isRead: false
    });

    res.json({
      count
    });

  } catch (error) {

    console.error("Unread count error:", error);

    res.status(500).json({
      error: "Failed to get unread count"
    });
  }
});


// =====================================
// MARK ONE NOTIFICATION AS READ
// =====================================

router.put("/:id/read", authenticateUser, async (req, res) => {
  try {

    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id
      },
      {
        isRead: true
      },
      {
        new: true
      }
    );

    if (!notification) {
      return res.status(404).json({
        error: "Notification not found"
      });
    }

    res.json({
      message: "Notification marked as read",
      notification
    });

  } catch (error) {

    console.error("Mark notification error:", error);

    res.status(500).json({
      error: "Failed to update notification"
    });
  }
});


// =====================================
// MARK ALL AS READ
// =====================================

router.put("/read-all", authenticateUser, async (req, res) => {
  try {

    await Notification.updateMany(
      {
        user: req.user.id,
        isRead: false
      },
      {
        isRead: true
      }
    );

    res.json({
      message: "All notifications marked as read"
    });

  } catch (error) {

    console.error("Read all error:", error);

    res.status(500).json({
      error: "Failed to mark notifications as read"
    });
  }
});


module.exports = router;