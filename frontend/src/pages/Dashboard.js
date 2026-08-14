import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [notifications, setNotifications] =
    useState([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const token =
    localStorage.getItem("token");

  const API =
    "https://student-portal-backend-401n.onrender.com";

  // =====================================
  // GET STUDENT PROFILE
  // =====================================

  const getProfile = async () => {
    try {
      const res = await axios.get(
        `${API}/auth/me`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setUser(res.data);

    } catch (error) {
      console.error(
        "Profile error:",
        error
      );

      localStorage.removeItem("token");
      localStorage.removeItem("role");

      navigate("/");
    }
  };

  // =====================================
  // GET NOTIFICATIONS
  // =====================================

  const getNotifications = async () => {
    try {
      const res = await axios.get(
        `${API}/notifications`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setNotifications(res.data);

      const unread =
        res.data.filter(
          notification =>
            !notification.isRead
        ).length;

      setUnreadCount(unread);

    } catch (error) {
      console.error(
        "Notification error:",
        error
      );
    }
  };

  // =====================================
  // INITIAL LOAD
  // =====================================

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const loadData = async () => {
      await getProfile();
      await getNotifications();

      setLoading(false);
    };

    loadData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =====================================
  // AUTO REFRESH NOTIFICATIONS
  // EVERY 10 SECONDS
  // =====================================

  useEffect(() => {
    if (!token) return;

    const interval =
      setInterval(() => {
        getNotifications();
      }, 10000);

    return () =>
      clearInterval(interval);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // =====================================
  // MARK NOTIFICATION AS READ
  // =====================================

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `${API}/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setNotifications(prev =>
        prev.map(notification =>
          notification._id === id
            ? {
                ...notification,
                isRead: true
              }
            : notification
        )
      );

      setUnreadCount(prev =>
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
  // MARK ALL READ
  // =====================================

  const markAllAsRead = async () => {
    try {
      await axios.put(
        `${API}/notifications/read-all`,
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setNotifications(prev =>
        prev.map(notification => ({
          ...notification,
          isRead: true
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
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div style={pageStyle}>
        <h2
          style={{
            color: "white"
          }}
        >
          Loading Dashboard...
        </h2>
      </div>
    );
  }

  // =====================================
  // DASHBOARD
  // =====================================

  return (
    <div style={pageStyle}>

      <div style={containerStyle}>

        {/* HEADER */}

        <div style={headerStyle}>

          <div>

            <h1 style={headingStyle}>
              Student Dashboard
            </h1>

            <p style={welcomeStyle}>
              Welcome,{" "}
              <strong>
                {user?.name}
              </strong>
            </p>

          </div>

          {/* NOTIFICATION BELL */}

          <div style={notificationBell}>
            🔔

            {unreadCount > 0 && (
              <span
                style={badgeStyle}
              >
                {unreadCount}
              </span>
            )}
          </div>

        </div>

        {/* NOTIFICATIONS */}

        <div
          style={
            notificationCardStyle
          }
        >

          <div
            style={
              notificationHeader
            }
          >

            <h2
              style={sectionTitle}
            >
              Notifications
            </h2>

            {unreadCount > 0 && (
              <button
                onClick={
                  markAllAsRead
                }
                style={
                  readAllButton
                }
              >
                Mark All as Read
              </button>
            )}

          </div>

          {notifications.length === 0 ? (

            <div
              style={
                emptyNotification
              }
            >
              🔔 No notifications yet.
            </div>

          ) : (

            notifications.map(
              notification => (

                <div
                  key={
                    notification._id
                  }
                  style={
                    getNotificationStyle(
                      notification.type,
                      notification.isRead
                    )
                  }
                  onClick={() =>
                    !notification.isRead &&
                    markAsRead(
                      notification._id
                    )
                  }
                >

                  <div
                    style={
                      notificationTitleRow
                    }
                  >

                    <h3>
                      {
                        notification.title
                      }
                    </h3>

                    {!notification.isRead && (
                      <span
                        style={newBadge}
                      >
                        NEW
                      </span>
                    )}

                  </div>

                  <p>
                    {
                      notification.message
                    }
                  </p>

                  <small>
                    {new Date(
                      notification.createdAt
                    ).toLocaleString()}
                  </small>

                </div>

              )
            )

          )}

        </div>

        {/* APPROVAL STATUS */}

        <div
          style={
            getStatusStyle(
              user?.approvalStatus
            )
          }
        >

          {user?.approvalStatus ===
            "pending" && (
            <>
              <h2>
                🟡 Approval Pending
              </h2>

              <p>
                Your application is
                waiting for administrator
                approval.
              </p>
            </>
          )}

          {user?.approvalStatus ===
            "approved" && (
            <>
              <h2>
                🟢 Account Approved
              </h2>

              <p>
                Your account has been
                approved.
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
              <h2>
                🔴 Application Rejected
              </h2>

              <p>
                Your application was
                rejected by the
                administrator.
              </p>
            </>
          )}

        </div>

        {/* STUDENT DETAILS */}

        <div
          style={
            detailsCardStyle
          }
        >

          <h2
            style={sectionTitle}
          >
            My Details
          </h2>

          <p>
            <strong>
              Name:
            </strong>{" "}
            {user?.name}
          </p>

          <p>
            <strong>
              Email:
            </strong>{" "}
            {user?.email}
          </p>

          <p>
            <strong>
              Phone:
            </strong>{" "}
            {user?.phone ||
              "Not provided"}
          </p>

          <p>
            <strong>
              Department:
            </strong>{" "}
            {user?.department ||
              "Not provided"}
          </p>

          <p>
            <strong>
              Semester:
            </strong>{" "}
            {user?.semester ||
              "Not provided"}
          </p>

          <p>
            <strong>
              Roll Number:
            </strong>{" "}
            {user?.rollNumber ||
              "Not provided"}
          </p>

          <p>
            <strong>
              College:
            </strong>{" "}
            {user?.college ||
              "Not provided"}
          </p>

        </div>

        {/* LOGOUT */}

        <button
          onClick={() => {
            localStorage.removeItem(
              "token"
            );

            localStorage.removeItem(
              "role"
            );

            navigate("/");
          }}
          style={logoutButton}
        >
          Logout
        </button>

      </div>

    </div>
  );
}

// =====================================
// STYLES
// =====================================

const pageStyle = {
  minHeight: "100vh",
  background:
    "linear-gradient(135deg, #0f172a, #1e293b)",
  padding: "40px 20px",
  boxSizing: "border-box"
};

const containerStyle = {
  maxWidth: "1000px",
  margin: "auto"
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px"
};

const headingStyle = {
  color: "white",
  fontSize: "40px",
  margin: 0
};

const welcomeStyle = {
  color: "#cbd5e1",
  fontSize: "18px"
};

const notificationBell = {
  position: "relative",
  fontSize: "35px",
  cursor: "pointer"
};

const badgeStyle = {
  position: "absolute",
  top: "-8px",
  right: "-10px",
  background: "#ef4444",
  color: "white",
  borderRadius: "50%",
  minWidth: "24px",
  height: "24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "13px",
  fontWeight: "bold"
};

const notificationCardStyle = {
  background: "#1e293b",
  border: "1px solid #475569",
  borderRadius: "18px",
  padding: "25px",
  marginBottom: "25px"
};

const notificationHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const sectionTitle = {
  color: "white",
  fontSize: "28px"
};

const readAllButton = {
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "7px",
  padding: "10px 15px",
  cursor: "pointer"
};

const emptyNotification = {
  background: "#0f172a",
  padding: "25px",
  borderRadius: "10px",
  color: "#cbd5e1",
  textAlign: "center"
};

const notificationTitleRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const newBadge = {
  background: "#2563eb",
  color: "white",
  padding: "4px 8px",
  borderRadius: "5px",
  fontSize: "11px",
  fontWeight: "bold"
};

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

  return {
    background: isRead
      ? "#172033"
      : "#0f172a",

    borderLeft:
      `5px solid ${borderColor}`,

    borderRadius: "8px",

    padding: "18px",

    marginTop: "12px",

    color: "#e2e8f0",

    cursor: isRead
      ? "default"
      : "pointer"
  };
};

const getStatusStyle = (
  status
) => {
  if (status === "approved") {
    return {
      background: "#052e16",
      border:
        "1px solid #22c55e",
      color: "#bbf7d0",
      padding: "25px",
      borderRadius: "15px",
      textAlign: "center",
      marginBottom: "25px"
    };
  }

  if (status === "rejected") {
    return {
      background: "#450a0a",
      border:
        "1px solid #ef4444",
      color: "#fecaca",
      padding: "25px",
      borderRadius: "15px",
      textAlign: "center",
      marginBottom: "25px"
    };
  }

  return {
    background: "#3b2f0b",
    border:
      "1px solid #eab308",
    color: "#fde68a",
    padding: "25px",
    borderRadius: "15px",
    textAlign: "center",
    marginBottom: "25px"
  };
};

const buttonStyle = {
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "12px 25px",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer"
};

const detailsCardStyle = {
  background: "#1e293b",
  border:
    "1px solid #475569",
  borderRadius: "18px",
  padding: "25px",
  color: "#cbd5e1"
};

const logoutButton = {
  display: "block",
  margin: "30px auto",
  padding: "12px 30px",
  background: "#334155",
  color: "white",
  border:
    "1px solid #64748b",
  borderRadius: "8px",
  cursor: "pointer"
};

export default Dashboard;