import React, { useEffect, useState } from "react";

const API_URL =
  "https://student-portal-backend-401n.onrender.com";

function Admin() {
  const [pendingStudents, setPendingStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [loadingPending, setLoadingPending] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // ==========================================
  // CHECK ADMIN
  // ==========================================

  useEffect(() => {
    if (!token || role !== "admin") {
      window.location.href = "/";
    }
  }, [token, role]);


  // ==========================================
  // FETCH PENDING STUDENTS
  // ==========================================

  const fetchPendingStudents = async () => {
    try {
      setLoadingPending(true);

      const response = await fetch(
        `${API_URL}/admin/pending-students`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load pending students"
        );
      }

      setPendingStudents(
        Array.isArray(data) ? data : []
      );

    } catch (error) {
      console.error("Pending students error:", error);
      setPendingStudents([]);
    } finally {
      setLoadingPending(false);
    }
  };


  // ==========================================
  // FETCH ALL STUDENTS
  // ==========================================

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);

      const response = await fetch(
        `${API_URL}/admin/students`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load students"
        );
      }

      setStudents(
        Array.isArray(data) ? data : []
      );

    } catch (error) {
      console.error("Students error:", error);
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };


  // ==========================================
  // FETCH COURSES
  // ==========================================

  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);

      const response = await fetch(
        `${API_URL}/admin/courses`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load courses"
        );
      }

      setCourses(
        Array.isArray(data) ? data : []
      );

    } catch (error) {
      console.error("Courses error:", error);
      setCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  };


  // ==========================================
  // LOAD DATA
  // ==========================================

  const loadData = () => {
    if (!token || role !== "admin") {
      return;
    }

    fetchPendingStudents();
    fetchStudents();
    fetchCourses();
  };


  useEffect(() => {
    loadData();
  }, []);


  // ==========================================
  // CREATE NOTIFICATION
  // ==========================================

  const createNotification = async (
    studentId,
    title,
    message,
    type
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/notifications`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: studentId,
            title,
            message,
            type
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "Notification error:",
          data
        );
      }

    } catch (error) {
      console.error(
        "Create notification error:",
        error
      );
    }
  };


  // ==========================================
  // APPROVE STUDENT
  // ==========================================

  const approveStudent = async (student) => {
    const confirmApprove = window.confirm(
      `Approve ${student.name}?`
    );

    if (!confirmApprove) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/admin/students/${student._id}/approve`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to approve student"
        );
      }

      // CREATE APPROVAL NOTIFICATION
      await createNotification(
        student._id,
        "Account Approved",
        "Congratulations! Your student account has been approved by the administrator.",
        "success"
      );

      alert(
        "Student approved successfully!"
      );

      loadData();

    } catch (error) {
      console.error(
        "Approve error:",
        error
      );

      alert(error.message);
    }
  };


  // ==========================================
  // REJECT STUDENT
  // ==========================================

  const rejectStudent = async (student) => {
    const confirmReject = window.confirm(
      `Reject ${student.name}?`
    );

    if (!confirmReject) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/admin/students/${student._id}/reject`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to reject student"
        );
      }

      // CREATE REJECTION NOTIFICATION
      await createNotification(
        student._id,
        "Application Rejected",
        "Your student application has been rejected by the administrator. Please contact the administrator for more information.",
        "error"
      );

      alert(
        "Student rejected."
      );

      loadData();

    } catch (error) {
      console.error(
        "Reject error:",
        error
      );

      alert(error.message);
    }
  };


  // ==========================================
  // DELETE STUDENT
  // ==========================================

  const deleteStudent = async (student) => {
    const confirmDelete = window.confirm(
      `Delete ${student.name}?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/admin/students/${student._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete student"
        );
      }

      alert(
        "Student deleted successfully."
      );

      loadData();

    } catch (error) {
      console.error(
        "Delete error:",
        error
      );

      alert(error.message);
    }
  };


  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    window.location.href = "/";
  };


  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div style={pageStyle}>

      {/* HEADER */}

      <div style={headerStyle}>

        <div>
          <h1 style={mainHeadingStyle}>
            Admin Dashboard
          </h1>

          <p style={welcomeStyle}>
            Manage students, approvals and courses.
          </p>
        </div>

        <div style={headerButtons}>

          <button
            onClick={loadData}
            style={refreshButton}
          >
            🔄 Refresh
          </button>

          <button
            onClick={logout}
            style={logoutButton}
          >
            Logout
          </button>

        </div>

      </div>


      {/* =====================================
          PENDING STUDENTS
      ===================================== */}

      <section style={sectionStyle}>

        <h2 style={sectionHeading}>
          🟡 Pending Student Approvals
        </h2>

        {loadingPending ? (

          <div style={emptyBox}>
            Loading pending students...
          </div>

        ) : pendingStudents.length === 0 ? (

          <div style={emptyBox}>
            ✅ No pending student requests.
          </div>

        ) : (

          <div style={tableWrapper}>

            <table style={tableStyle}>

              <thead>
                <tr style={tableHeadRow}>

                  <th style={thStyle}>
                    Name
                  </th>

                  <th style={thStyle}>
                    Email
                  </th>

                  <th style={thStyle}>
                    Phone
                  </th>

                  <th style={thStyle}>
                    Department
                  </th>

                  <th style={thStyle}>
                    Semester
                  </th>

                  <th style={thStyle}>
                    Roll Number
                  </th>

                  <th style={thStyle}>
                    College
                  </th>

                  <th style={thStyle}>
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {pendingStudents.map(
                  (student) => (

                    <tr key={student._id}>

                      <td style={tdStyle}>
                        {student.name}
                      </td>

                      <td style={tdStyle}>
                        {student.email}
                      </td>

                      <td style={tdStyle}>
                        {student.phone || "N/A"}
                      </td>

                      <td style={tdStyle}>
                        {student.department || "N/A"}
                      </td>

                      <td style={tdStyle}>
                        {student.semester || "N/A"}
                      </td>

                      <td style={tdStyle}>
                        {student.rollNumber || "N/A"}
                      </td>

                      <td style={tdStyle}>
                        {student.college || "N/A"}
                      </td>

                      <td style={tdStyle}>

                        <button
                          onClick={() =>
                            approveStudent(student)
                          }
                          style={approveButton}
                        >
                          ✓ Approve
                        </button>

                        <button
                          onClick={() =>
                            rejectStudent(student)
                          }
                          style={rejectButton}
                        >
                          ✕ Reject
                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>


      {/* =====================================
          COURSES
      ===================================== */}

      <section style={sectionStyle}>

        <h2 style={sectionHeading}>
          📚 Available Courses
        </h2>

        {loadingCourses ? (

          <div style={emptyBox}>
            Loading courses...
          </div>

        ) : courses.length === 0 ? (

          <div style={emptyBox}>
            No courses available.
          </div>

        ) : (

          <div style={courseGrid}>

            {courses.map(
              (course) => (

                <div
                  key={course._id}
                  style={courseCard}
                >

                  <h3 style={courseTitle}>
                    {course.title}
                  </h3>

                  <p style={courseDescription}>
                    {course.description ||
                      "No description"}
                  </p>

                  <p style={instructorText}>
                    <strong>
                      Instructor:
                    </strong>{" "}
                    {course.instructor ||
                      "Not assigned"}
                  </p>

                </div>

              )
            )}

          </div>

        )}

      </section>


      {/* =====================================
          ALL STUDENTS
      ===================================== */}

      <section style={sectionStyle}>

        <h2 style={sectionHeading}>
          👨‍🎓 All Students
        </h2>

        {loadingStudents ? (

          <div style={emptyBox}>
            Loading students...
          </div>

        ) : students.length === 0 ? (

          <div style={emptyBox}>
            No students found.
          </div>

        ) : (

          <div style={tableWrapper}>

            <table style={tableStyle}>

              <thead>

                <tr style={tableHeadRow}>

                  <th style={thStyle}>
                    Name
                  </th>

                  <th style={thStyle}>
                    Email
                  </th>

                  <th style={thStyle}>
                    Department
                  </th>

                  <th style={thStyle}>
                    Semester
                  </th>

                  <th style={thStyle}>
                    Status
                  </th>

                  <th style={thStyle}>
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {students.map(
                  (student) => (

                    <tr key={student._id}>

                      <td style={tdStyle}>
                        {student.name}
                      </td>

                      <td style={tdStyle}>
                        {student.email}
                      </td>

                      <td style={tdStyle}>
                        {student.department ||
                          "Not provided"}
                      </td>

                      <td style={tdStyle}>
                        {student.semester ||
                          "Not provided"}
                      </td>

                      <td style={tdStyle}>

                        <span
                          style={
                            student.approvalStatus ===
                            "approved"
                              ? approvedBadge
                              : student.approvalStatus ===
                                "rejected"
                              ? rejectedBadge
                              : pendingBadge
                          }
                        >
                          {student.approvalStatus ||
                            "pending"}
                        </span>

                      </td>

                      <td style={tdStyle}>

                        <button
                          onClick={() =>
                            deleteStudent(student)
                          }
                          style={deleteButton}
                        >
                          🗑 Delete
                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </div>
  );
}


// =====================================================
// STYLES
// =====================================================

const pageStyle = {
  minHeight: "100vh",
  background:
    "linear-gradient(135deg, #0f172a, #172033)",
  color: "#ffffff",
  padding: "30px",
  boxSizing: "border-box",
  fontFamily:
    "Arial, Helvetica, sans-serif"
};


const headerStyle = {
  maxWidth: "1250px",
  margin: "0 auto 35px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px"
};


const mainHeadingStyle = {
  fontSize: "48px",
  margin: "0",
  color: "#ffffff"
};


const welcomeStyle = {
  color: "#cbd5e1",
  fontSize: "18px",
  marginTop: "8px"
};


const headerButtons = {
  display: "flex",
  gap: "12px"
};


const refreshButton = {
  padding: "14px 25px",
  background: "#2563eb",
  color: "#ffffff",
  border: "none",
  borderRadius: "10px",
  fontSize: "17px",
  fontWeight: "bold",
  cursor: "pointer"
};


const logoutButton = {
  padding: "14px 25px",
  background: "#dc2626",
  color: "#ffffff",
  border: "none",
  borderRadius: "10px",
  fontSize: "17px",
  fontWeight: "bold",
  cursor: "pointer"
};


const sectionStyle = {
  maxWidth: "1250px",
  margin: "0 auto 45px",
  padding: "38px",
  background: "#1e293b",
  border: "1px solid #475569",
  borderRadius: "22px",
  boxShadow:
    "0 10px 35px rgba(0,0,0,0.25)",
  boxSizing: "border-box"
};


const sectionHeading = {
  fontSize: "32px",
  marginTop: "0",
  marginBottom: "28px",
  color: "#ffffff"
};


const emptyBox = {
  background: "#0f172a",
  padding: "40px",
  borderRadius: "16px",
  textAlign: "center",
  color: "#cbd5e1",
  fontSize: "20px"
};


const tableWrapper = {
  width: "100%",
  overflowX: "auto"
};


const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "1000px"
};


const tableHeadRow = {
  background: "#374151"
};


const thStyle = {
  padding: "16px",
  textAlign: "left",
  color: "#ffffff",
  fontSize: "16px",
  borderBottom:
    "1px solid #64748b"
};


const tdStyle = {
  padding: "16px",
  color: "#f8fafc",
  fontSize: "15px",
  borderBottom:
    "1px solid #475569"
};


const approveButton = {
  padding: "10px 14px",
  marginRight: "8px",
  marginBottom: "5px",
  background: "#16a34a",
  color: "#ffffff",
  border: "none",
  borderRadius: "7px",
  fontWeight: "bold",
  cursor: "pointer"
};


const rejectButton = {
  padding: "10px 14px",
  background: "#dc2626",
  color: "#ffffff",
  border: "none",
  borderRadius: "7px",
  fontWeight: "bold",
  cursor: "pointer"
};


const deleteButton = {
  padding: "10px 16px",
  background: "#dc2626",
  color: "#ffffff",
  border: "none",
  borderRadius: "7px",
  fontWeight: "bold",
  cursor: "pointer"
};


const approvedBadge = {
  background: "#166534",
  color: "#bbf7d0",
  padding: "7px 12px",
  borderRadius: "20px",
  fontWeight: "bold"
};


const rejectedBadge = {
  background: "#7f1d1d",
  color: "#fecaca",
  padding: "7px 12px",
  borderRadius: "20px",
  fontWeight: "bold"
};


const pendingBadge = {
  background: "#854d0e",
  color: "#fef08a",
  padding: "7px 12px",
  borderRadius: "20px",
  fontWeight: "bold"
};


const courseGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "20px"
};


const courseCard = {
  background: "#0f172a",
  border: "1px solid #475569",
  borderRadius: "15px",
  padding: "25px"
};


const courseTitle = {
  color: "#ffffff",
  fontSize: "24px",
  marginTop: "0"
};


const courseDescription = {
  color: "#cbd5e1",
  lineHeight: "1.6"
};


const instructorText = {
  color: "#e2e8f0"
};


export default Admin;