import React, { useEffect, useState } from "react";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://student-portal-backend-401n.onrender.com/courses")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
        setError("Unable to load courses.");
        setLoading(false);
      });
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#111827",
        color: "white",
        padding: "50px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            color: "white",
            textAlign: "center",
            fontSize: "36px",
            marginBottom: "35px",
          }}
        >
          Available Courses
        </h2>

        {loading && (
          <p style={{ color: "#d1d5db", textAlign: "center" }}>
            Loading courses...
          </p>
        )}

        {error && (
          <p style={{ color: "#fca5a5", textAlign: "center" }}>
            {error}
          </p>
        )}

        {!loading && !error && courses.length === 0 && (
          <p style={{ color: "#d1d5db", textAlign: "center" }}>
            No courses available.
          </p>
        )}

        <div>
          {courses.map((course) => (
            <div
              key={course._id}
              style={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "15px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
              }}
            >
              <h3
                style={{
                  color: "white",
                  fontSize: "24px",
                  marginBottom: "10px",
                }}
              >
                {course.title}
              </h3>

              <p
                style={{
                  color: "#d1d5db",
                  fontSize: "16px",
                  marginBottom: "8px",
                }}
              >
                {course.description}
              </p>

              <p
                style={{
                  color: "#93c5fd",
                  fontSize: "16px",
                }}
              >
                Instructor: {course.instructor}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Courses;