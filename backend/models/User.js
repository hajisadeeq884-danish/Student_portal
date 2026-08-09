const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    course: { type: String, default: "Not assigned" }, // ✅ new field
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }]
  },
  { timestamps: true } // ✅ adds createdAt and updatedAt automatically
);

// ✅ Ensure model is not overwritten if already compiled
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
