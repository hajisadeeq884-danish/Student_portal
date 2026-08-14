import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const API =
    "https://student-portal-backend-401n.onrender.com";

  // =====================================
  // GET STUDENT PROFILE
  // =====================================

  const getProfile = useCallback(async () => {
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const res = await axios.get(
        `${API}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(res.data);
    } catch (error) {
      console.error("Profile error:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("role");

      navigate("/");
    }
  }, [token, navigate]);

  // =====================================
  // GET NOTIFICATIONS
  // =====================================

  const getNotifications = useCallback(async () => {
    if (!token) {
      return;
    }

    try {
      const res = await axios.get(
        `${API}/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = Array.isArray(res.data)
        ? res.data
        : [];

      setNotifications(data);

      const unread = data.filter(
        (notification) =>
          !notification.isRead
      ).length;

      setUnreadCount(unread);
    } catch (error) {
      console.error(
        "Notification error:",
        error
      );

      // If notification route is unavailable,
      // don't break the dashboard.
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [token]);

  // =====================================
  // INITIAL LOAD
  // =====================================

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const loadData = async () => {
      try {
        await getProfile();
        await getNotifications();
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [
    token,
    navigate,
    getProfile,
    getNotifications,
  ]);

  // =====================================
  // AUTO REFRESH NOTIFICATIONS
  // EVERY 10 SECONDS
  // =====================================

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    const interval = setInterval(() => {
      getNotifications();
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [token, getNotifications]);

  // =====================================
  // MARK NOTIFICATION AS READ
  // =====================================

  const markAsRead = async (id) => {
    if (!token) {
      return;
    }

    try {
      await axios.put(
        `${API}/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );

      setUnreadCount((prev) =>
        Math.max(prev - 1, 0)
      );
    } catch (error) {
      console.error(
        "Mark read error:",
        error
      );
    }
  };

  // =====================================
  // MARK ALL NOTIFICATIONS AS READ
  // =====================================

  const markAllAsRead = async () => {
    if (!token) {
      return;
    }

    try {
      await axios.put(
        `${API}/notifications/read-all`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(
        "Mark all read error:",
        error
      );
    }
  };

  // =====================================
  // LOGOUT
  // =====================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/");
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={loadingBox}>
          <div style={loadingIcon}>⏳</div>

          <h2 style={loadingHeading}>
            Loading Dashboard...
          </h2>

          <p style={loadingText}>
            Please wait while we load your
            student information.
          </p>
        </div>
      </div>
    );
  }

  // =====================================
  // DASHBOARD
  // =====================================

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>

        {/* =================================
            HEADER
        ================================= */}

        <div style={headerStyle}>
          <div>
            <h1 style={headingStyle}>
              Student Dashboard
            </h1>

            <p style={welcomeStyle}>
              Welcome,{" "}
              <strong>
                {user?.name || "Student"}
              </strong>
            </p>
          </div>

          {/* NOTIFICATION BELL */}

          <div style={notificationBell}>
            🔔

            {unreadCount > 0 && (
              <span style={badgeStyle}>
                {unreadCount > 99
                  ? "99+"
                  : unreadCount}
              </span>
            )}
          </div>
        </div>

        {/* =================================
            NOTIFICATIONS
        ================================= */}

        <div style={notificationCardStyle}>
          <div style={notificationHeader}>
            <div>
              <h2 style={sectionTitle}>
                Notifications
              </h2>

              <p style={sectionSubtitle}>
                Stay updated with your account.
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={readAllButton}
              >
                Mark All as Read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div style={emptyNotification}>
              <div style={emptyIcon}>
                🔔
              </div>

              <div>
                No notifications yet.
              </div>
            </div>
          ) : (
            notifications.map(
              (notification) => (
                <div
                  key={notification._id}
                  style={getNotificationStyle(
                    notification.type,
                    notification.isRead
                  )}
                  onClick={() => {
                    if (
                      !notification.isRead
                    ) {
                      markAsRead(
                        notification._id
                      );
                    }
                  }}
                >
                  <div
                    style={
                      notificationTitleRow
                    }
                  >
                    <h3
                      style={
                        notificationHeading
                      }
                    >
                      {notification.title ||
                        "Notification"}
                    </h3>

                    {!notification.isRead && (
                      <span style={newBadge}>
                        NEW
                      </span>
                    )}
                  </div>

                  <p
                    style={
                      notificationMessage
                    }
                  >
                    {notification.message ||
                      "You have a new notification."}
                  </p>

                  {notification.createdAt && (
                    <small
                      style={
                        notificationDate
                      }
                    >
                      {new Date(
                        notification.createdAt
                      ).toLocaleString()}
                    </small>
                  )}
                </div>
              )
            )
          )}
        </div>

        {/* =================================
            APPROVAL STATUS
        ================================= */}

        <div
          style={getStatusStyle(
            user?.approvalStatus
          )}
        >
          {user?.approvalStatus ===
            "pending" && (
            <>
              <div style={statusIcon}>
                🟡
              </div>

              <h2>
                Approval Pending
              </h2>

              <p>
                Your application is waiting
                for administrator approval.
              </p>
            </>
          )}

          {user?.approvalStatus ===
            "approved" && (
            <>
              <div style={statusIcon}>
                🟢
              </div>

              <h2>
                Account Approved
              </h2>

              <p>
                Your account has been
                approved successfully.
              </p>

              <button
                onClick={() =>
                  navigate("/courses")
                }
                style={buttonStyle}
              >
                View Courses
              </button>
            </>
          )}

          {user?.approvalStatus ===
            "rejected" && (
            <>
              <div style={statusIcon}>
                🔴
              </div>

              <h2>
                Application Rejected
              </h2>

              <p>
                Your application was
                rejected by the administrator.
              </p>
            </>
          )}
        </div>

        {/* =================================
            STUDENT DETAILS
        ================================= */}

        <div style={detailsCardStyle}>
          <h2 style={sectionTitle}>
            My Details
          </h2>

          <div style={detailsGrid}>
            <Detail
              label="Name"
              value={user?.name}
            />

            <Detail
              label="Email"
              value={user?.email}
            />

            <Detail
              label="Phone"
              value={user?.phone}
            />

            <Detail
              label="Department"
              value={user?.department}
            />

            <Detail
              label="Semester"
              value={user?.semester}
            />

            <Detail
              label="Roll Number"
              value={user?.rollNumber}
            />

            <Detail
              label="College"
              value={user?.college}
            />

            <Detail
              label="Account Status"
              value={
                user?.approvalStatus ||
                "pending"
              }
            />
          </div>
        </div>

        {/* =================================
            LOGOUT
        ================================= */}

        <button
          onClick={logout}
          style={logoutButton}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

// =====================================
// DETAIL COMPONENT
// =====================================

function Detail({ label, value }) {
  return (
    <div style={detailItem}>
      <span style={detailLabel}>
        {label}
      </span>

      <span style={detailValue}>
        {value || "Not provided"}
      </span>
    </div>
  );
}

// =====================================
// NOTIFICATION STYLE
// =====================================

const getNotificationStyle = (
  type,
  isRead
) => {
  let borderColor = "#475569";

  if (type === "success") {
    borderColor = "#22c55e";
  }

  if (type === "error") {
    borderColor = "#ef4444";
  }

  if (type === "warning") {
    borderColor = "#eab308";
  }

  if (type === "info") {
    borderColor = "#3b82f6";
  }

  return {
    background: isRead
      ? "#172033"
      : "#0f172a",

    borderLeft:
      `5px solid ${borderColor}`,

    borderRadius: "10px",

    padding: "18px",

    marginTop: "12px",

    color: "#e2e8f0",

    cursor: isRead
      ? "default"
      : "pointer",

    transition:
      "all 0.2s ease",
  };
};

// =====================================
// STATUS STYLE
// =====================================

const getStatusStyle = (status) => {
  if (status === "approved") {
    return {
      background: "#052e16",
      border: "1px solid #22c55e",
      color: "#bbf7d0",
      padding: "30px",
      borderRadius: "18px",
      textAlign: "center",
      marginBottom: "25px",
    };
  }

  if (status === "rejected") {
    return {
      background: "#450a0a",
      border: "1px solid #ef4444",
      color: "#fecaca",
      padding: "30px",
      borderRadius: "18px",
      textAlign: "center",
      marginBottom: "25px",
    };
  }

  return {
    background: "#3b2f0b",
    border: "1px solid #eab308",
    color: "#fde68a",
    padding: "30px",
    borderRadius: "18px",
    textAlign: "center",
    marginBottom: "25px",
  };
};

// =====================================
// PAGE
// =====================================

const pageStyle = {
  minHeight: "100vh",
  background:
    "linear-gradient(135deg, #0f172a, #1e293b)",
  padding: "40px 20px",
  boxSizing: "border-box",
  fontFamily:
    "Arial, Helvetica, sans-serif",
};

const containerStyle = {
  maxWidth: "1000px",
  margin: "auto",
};

const loadingBox = {
  maxWidth: "500px",
  margin: "100px auto",
  background: "#1e293b",
  border: "1px solid #475569",
  borderRadius: "20px",
  padding: "45px",
  textAlign: "center",
  color: "white",
};

const loadingIcon = {
  fontSize: "45px",
};

const loadingHeading = {
  marginBottom: "10px",
};

const loadingText = {
  color: "#94a3b8",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
  gap: "20px",
};

const headingStyle = {
  color: "white",
  fontSize: "40px",
  margin: 0,
};

const welcomeStyle = {
  color: "#cbd5e1",
  fontSize: "18px",
};

const notificationBell = {
  position: "relative",
  fontSize: "35px",
  cursor: "default",
  background: "#1e293b",
  border: "1px solid #475569",
  borderRadius: "14px",
  padding: "10px 15px",
};

const badgeStyle = {
  position: "absolute",
  top: "-8px",
  right: "-8px",
  background: "#ef4444",
  color: "white",
  borderRadius: "50%",
  minWidth: "24px",
  height: "24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
  fontWeight: "bold",
};

const notificationCardStyle = {
  background: "#1e293b",
  border: "1px solid #475569",
  borderRadius: "18px",
  padding: "25px",
  marginBottom: "25px",
};

const notificationHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
};

const sectionTitle = {
  color: "white",
  fontSize: "28px",
  marginTop: 0,
  marginBottom: "8px",
};

const sectionSubtitle = {
  color: "#94a3b8",
  marginTop: 0,
};

const readAllButton = {
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "10px 15px",
  cursor: "pointer",
  fontWeight: "bold",
};

const emptyNotification = {
  background: "#0f172a",
  padding: "30px",
  borderRadius: "10px",
  color: "#cbd5e1",
  textAlign: "center",
  marginTop: "15px",
};

const emptyIcon = {
  fontSize: "30px",
  marginBottom: "8px",
};

const notificationTitleRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "10px",
};

const notificationHeading = {
  margin: 0,
  color: "white",
};

const notificationMessage = {
  color: "#cbd5e1",
  lineHeight: "1.6",
};

const notificationDate = {
  color: "#94a3b8",
};

const newBadge = {
  background: "#2563eb",
  color: "white",
  padding: "4px 8px",
  borderRadius: "5px",
  fontSize: "11px",
  fontWeight: "bold",
};

const statusIcon = {
  fontSize: "35px",
};

const buttonStyle = {
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "12px 25px",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
};

const detailsCardStyle = {
  background: "#1e293b",
  border: "1px solid #475569",
  borderRadius: "18px",
  padding: "25px",
  color: "#cbd5e1",
};

const detailsGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "15px",
  marginTop: "20px",
};

const detailItem = {
  background: "#0f172a",
  border: "1px solid #334155",
  borderRadius: "10px",
  padding: "15px",
  display: "flex",
  flexDirection: "column",
  gap: "7px",
};

const detailLabel = {
  color: "#94a3b8",
  fontSize: "13px",
  fontWeight: "bold",
  textTransform: "uppercase",
};

const detailValue = {
  color: "#f8fafc",
  fontSize: "16px",
};

const logoutButton = {
  display: "block",
  margin: "30px auto",
  padding: "12px 30px",
  background: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default Dashboard;