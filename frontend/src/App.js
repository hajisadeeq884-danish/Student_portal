import {
  BrowserRouter as Router,
  Route,
  Routes
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

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/student-details"
          element={<StudentDetails />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/courses"
          element={<Courses />}
        />

        <Route
          path="/admin"
          element={<Admin />}
        />

      </Routes>
    </Router>
  );
}

export default App;