import React, { useEffect, useState } from "react";

function Admin() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingStudent, setEditingStudent] = useState(null);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseInstructor, setCourseInstructor] = useState("");
  const [addingCourse, setAddingCourse] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(
      "https://student-portal-backend-401n.onrender.com/admin/students",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setStudents(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
        setLoading(false);
      });
  }, [token]);

  const addCourse = async () => {
    if (!courseTitle || !courseDescription || !courseInstructor) {
      alert("Please fill all course fields.");
      return;
    }

    setAddingCourse(true);

    try {
      const res = await fetch(
        "https://student-portal-backend-401n.onrender.com/courses/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: courseTitle,
            description: courseDescription,
            instructor: courseInstructor,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || data.error || "Failed to add course.");
        return;
      }

      alert("Course added successfully!");

      setCourseTitle("");
      setCourseDescription("");
      setCourseInstructor("");
    } catch (err) {
      console.error("Add course error:", err);
      alert("Failed to add course.");
    } finally {
      setAddingCourse(false);
    }
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setNewName(student.name);
    setNewEmail(student.email);
  };

  const saveEdit = async () => {
    if (!editingStudent) return;

    try {
      const res = await fetch(
        `https://student-portal-backend-401n.onrender.com/admin/students/${editingStudent._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: newName,
            email: newEmail,
          }),
        }
      );

      const msg = await res.json();

      if (!res.ok) {
        alert(msg.message || msg.error || "Failed to update student.");
        return;
      }

      alert(msg.message || "Student updated successfully.");

      setStudents((prev) =>
        prev.map((s) =>
          s._id === editingStudent._id
            ? { ...s, name: newName, email: newEmail }
            : s
        )
      );

      setEditingStudent(null);
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update student.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      const res = await fetch(
        `https://student-portal-backend-401n.onrender.com/admin/students/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const msg = await res.json();

      if (!res.ok) {
        alert(msg.message || msg.error || "Failed to delete student.");
        return;
      }

      alert(msg.message || "Student deleted successfully.");

      setStudents((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete student.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#111827",
        color: "white",
        padding: "40px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "36px",
            color: "white",
            marginBottom: "35px",
          }}
        >
          Admin Dashboard
        </h2>

        {/* Add Course */}
        <div
          style={{
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "15px",
            padding: "25px",
            marginBottom: "35px",
          }}
        >
          <h3
            style={{
              color: "white",
              fontSize: "25px",
              marginBottom: "20px",
            }}
          >
            Add New Course
          </h3>

          <input
            type="text"
            placeholder="Course Title"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Course Description"
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Instructor"
            value={courseInstructor}
            onChange={(e) => setCourseInstructor(e.target.value)}
            style={inputStyle}
          />

          <button
            onClick={addCourse}
            disabled={addingCourse}
            style={buttonStyle}
          >
            {addingCourse ? "Adding..." : "Add Course"}
          </button>
        </div>

        {/* Students */}
        <div
          style={{
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "15px",
            padding: "25px",
          }}
        >
          <h3
            style={{
              color: "white",
              fontSize: "25px",
              marginBottom: "20px",
            }}
          >
            Students
          </h3>

          {loading ? (
            <p style={{ color: "#d1d5db" }}>Loading students...</p>
          ) : students.length === 0 ? (
            <p style={{ color: "#d1d5db" }}>No students found.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  color: "white",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#374151" }}>
                    <th style={cellStyle}>ID</th>
                    <th style={cellStyle}>Name</th>
                    <th style={cellStyle}>Email</th>
                    <th style={cellStyle}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td style={cellStyle}>{student._id}</td>
                      <td style={cellStyle}>{student.name}</td>
                      <td style={cellStyle}>{student.email}</td>

                      <td style={cellStyle}>
                        <button
                          onClick={() => openEditModal(student)}
                          style={smallButtonStyle}
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(student._id)}
                          style={smallButtonStyle}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Edit Student */}
        {editingStudent && (
          <div
            style={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "15px",
              padding: "25px",
              marginTop: "25px",
            }}
          >
            <h3 style={{ color: "white" }}>Edit Student</h3>

            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Name"
              style={inputStyle}
            />

            <input
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Email"
              style={inputStyle}
            />

            <button onClick={saveEdit} style={buttonStyle}>
              Save
            </button>

            <button
              onClick={() => setEditingStudent(null)}
              style={smallButtonStyle}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  maxWidth: "600px",
  boxSizing: "border-box",
  padding: "13px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #4b5563",
  backgroundColor: "#111827",
  color: "white",
  fontSize: "16px",
};

const buttonStyle = {
  padding: "12px 25px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#2563eb",
  color: "white",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
};

const smallButtonStyle = {
  padding: "8px 15px",
  margin: "4px",
  borderRadius: "6px",
  border: "1px solid #4b5563",
  backgroundColor: "#374151",
  color: "white",
  cursor: "pointer",
};

const cellStyle = {
  padding: "12px",
  borderBottom: "1px solid #4b5563",
  textAlign: "left",
};

export default Admin;