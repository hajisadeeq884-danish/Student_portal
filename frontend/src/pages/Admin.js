import React, { useEffect, useState } from "react";

function Admin() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStudent, setEditingStudent] = useState(null);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const token = localStorage.getItem("token");

  // Fetch students
  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/admin/students", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setStudents(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching students:", err);
        setLoading(false);
      });
  }, [token]);

  // Open modal for editing
  const openEditModal = (student) => {
    setEditingStudent(student);
    setNewName(student.name);
    setNewEmail(student.email);
  };

  // Save edits
  const saveEdit = async () => {
    try {
      const res = await fetch(`http://localhost:5000/admin/students/${editingStudent._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: newName, email: newEmail })
      });
      const msg = await res.json();
      alert(msg.message);
      setStudents(prev =>
        prev.map(s => (s._id === editingStudent._id ? { ...s, name: newName, email: newEmail } : s))
      );
      setEditingStudent(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete student
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      const res = await fetch(`http://localhost:5000/admin/students/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const msg = await res.json();
      alert(msg.message);
      setStudents(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>

      {loading ? (
        <p>Loading students...</p>
      ) : students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table border="1" style={{ width: "100%", marginTop: "20px" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student._id}>
                <td>{student._id}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>
                  <button onClick={() => openEditModal(student)}>Edit</button>
                  <button onClick={() => handleDelete(student._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Modal */}
      {editingStudent && (
        <div style={{
          border: "1px solid #ccc",
          padding: "20px",
          marginTop: "20px",
          background: "#f9f9f9"
        }}>
          <h3>Edit Student</h3>
          <label>
            Name: <input value={newName} onChange={(e) => setNewName(e.target.value)} />
          </label>
          <br />
          <label>
            Email: <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
          </label>
          <br />
          <button onClick={saveEdit}>Save</button>
          <button onClick={() => setEditingStudent(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default Admin;
