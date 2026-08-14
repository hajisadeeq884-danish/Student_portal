# 🎓 Student Portal

A full-stack **Student Portal** web application built with React.js, Node.js, Express.js, and MongoDB.

The application provides separate functionality for **students and administrators**, including student registration, account approval, course management, student details, and real-time-style notifications with read/unread status.

## 🚀 Live Demo

https://studentportal-one-wheat.vercel.app/
---

## ✨ Features

### 👨‍🎓 Student Features

* Student registration and login
* JWT-based authentication
* Student profile/details
* Account approval status

  * 🟡 Pending
  * 🟢 Approved
  * 🔴 Rejected
* View available courses
* Student dashboard
* Notifications system
* Unread notification counter
* Mark individual notifications as read
* Mark all notifications as read
* Automatic notification refresh
* Logout functionality

### 👨‍💼 Admin Features

* Admin authentication
* Admin dashboard
* View pending student registrations
* Approve students
* Reject students
* View all registered students
* Delete students
* View available courses
* Refresh dashboard data
* Student approval management

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router
* Axios
* JavaScript
* HTML5
* CSS
* Create React App
* Vercel

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* CORS
* dotenv
* Render

---

## 📁 Project Structure

```text
student-portal/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── StudentDetails.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Courses.js
│   │   │   └── Admin.js
│   │   │
│   │   ├── App.js
│   │   └── index.js
│   │
│   ├── package.json
│   └── README.md
│
├── backend/
│   ├── middleware/
│   │   └── admin.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   └── Notification.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── course.js
│   │   ├── admin.js
│   │   └── notificationRoutes.js
│   │
│   ├── createAdmin.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## 🔐 Authentication

The application uses **JWT authentication**.

After successful login, the JWT token is stored in the browser's local storage.

Protected API requests send the token using:

```text
Authorization: Bearer <token>
```

The backend validates the token before allowing access to protected resources.

---

## 🔔 Notification System

The Student Portal includes a notification system for students.

### Notification Features

* Display notifications on the dashboard
* Show unread notification count
* Mark individual notification as read
* Mark all notifications as read
* Automatically refresh notifications

### Notification API

```text
GET    /notifications
PUT    /notifications/:id/read
PUT    /notifications/read-all
```

---

## 👨‍💼 Admin Workflow

The basic student approval workflow is:

```text
Student Registration
        ↓
Pending Account
        ↓
Admin Dashboard
        ↓
Approve / Reject
        ↓
Student Account Status Updated
```

Approved students can access the available courses.

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
```

```bash
cd student-portal
```

---

# 💻 Frontend Setup

Go to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

The frontend will normally run at:

```text
http://localhost:3000
```

### Build for Production

```bash
npm run build
```

---

# 🖥️ Backend Setup

Open another terminal and go to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Start the backend:

```bash
npm start
```

The backend will normally run on:

```text
http://localhost:5000
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `backend` folder.

Example:

```env
DB_STRING=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

### ⚠️ Important

Never upload your real `.env` file or secrets to GitHub.

Add this to `.gitignore`:

```text
.env
node_modules/
```

---

## 🗄️ Database

This project uses **MongoDB** with **Mongoose**.

The main collections/models are:

* Users
* Courses
* Notifications

The backend connects to MongoDB using the `DB_STRING` environment variable.

---

## 🌐 API Routes

### Authentication

```text
POST /auth/register
POST /auth/login
GET  /auth/me
GET  /auth/test
```

### Courses

```text
GET /courses
```

### Admin

```text
GET    /admin/pending-students
GET    /admin/students
GET    /admin/courses
PUT    /admin/students/:id/approve
PUT    /admin/students/:id/reject
DELETE /admin/students/:id
```

### Notifications

```text
GET /notifications
PUT /notifications/:id/read
PUT /notifications/read-all
```

---

## 🔒 Security

The project uses:

* JWT authentication
* Protected routes
* Admin authorization middleware
* Environment variables for sensitive configuration
* CORS configuration
* Password authentication

Do not commit:

```text
.env
JWT secrets
MongoDB credentials
API secrets
```

---

## 🚀 Deployment

### Frontend

The React frontend can be deployed using **Vercel**.

Build command:

```bash
npm run build
```

Output directory:

```text
build
```

### Backend

The Express backend can be deployed using **Render**.

Start command:

```bash
node server.js
```

Make sure the following environment variables are configured on the hosting platform:

```text
DB_STRING
JWT_SECRET
PORT
```

---

## 🧪 Local Development

Run the backend:

```bash
cd backend
npm install
npm start
```

Run the frontend in another terminal:

```bash
cd frontend
npm install
npm start
```

Then open:

```text
http://localhost:3000
```

---

## 📌 Current Deployment

| Service  | Platform |
| -------- | -------- |
| Frontend | Vercel   |
| Backend  | Render   |
| Database | MongoDB  |

---

## 📸 Main Pages

The application contains:

* Login
* Registration
* Student Details
* Student Dashboard
* Courses
* Admin Dashboard
* Notifications

---

## 🔄 Future Improvements

Possible future enhancements include:

* Profile photo upload
* Course enrollment
* Student marks/results
* Attendance management
* Admin course creation/editing
* Email notifications
* Password reset
* Search and filtering
* Pagination
* Better mobile responsiveness
* Role-based route protection
* Advanced admin analytics

---

## 👨‍💻 Author

**Student Portal Project**

Built as a full-stack web application using modern JavaScript technologies.

---

## 📄 License

This project is available for educational and personal use.

---

⭐ If you find this project useful, consider giving the repository a star!
