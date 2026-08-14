const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student"
    },

    // Student details
    phone: {
      type: String,
      default: ""
    },

    dateOfBirth: {
      type: String,
      default: ""
    },

    gender: {
      type: String,
      default: ""
    },

    address: {
      type: String,
      default: ""
    },

    department: {
      type: String,
      default: ""
    },

    semester: {
      type: String,
      default: ""
    },

    rollNumber: {
      type: String,
      default: ""
    },

    college: {
      type: String,
      default: ""
    },

    course: {
      type: String,
      default: "Not assigned"
    },

    // Admin approval
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },

    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports =
  mongoose.models.User || mongoose.model("User", userSchema);