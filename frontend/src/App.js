import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDetails from "./pages/StudentDetails";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Admin from "./pages/Admin";

function App() {
  return (
    <Router>
      <Routes>

        {/* ================= LOGIN ================= */}
        <Route
          path="/"
          element={<Login />}
        />

        {/* ================= STUDENT REGISTER ================= */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* ================= STUDENT DETAILS ================= */}
        <Route
          path="/student-details"
          element={<StudentDetails />}
        />

        {/* ================= STUDENT DASHBOARD ================= */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* ================= COURSES ================= */}
        <Route
          path="/courses"
          element={<Courses />}
        />

        {/* ================= ADMIN DASHBOARD ================= */}
        <Route
          path="/admin"
          element={<Admin />}
        />

        {/* ================= UNKNOWN URL ================= */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </Router>
  );
}

export default App;