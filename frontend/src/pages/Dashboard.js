import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div>
      <h2>Student Dashboard</h2>
      <p>Welcome! Here you can view your enrolled courses and progress.</p>

      <div>
        <Link to="/courses">
          <button>View Courses</button>
        </Link>

        <Link to="/admin">
          <button>Admin Panel</button>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;