# Complete JWT Authentication - Code Reference

This file contains all the complete working code for JWT authentication in your React Vite project.

---

## 1️⃣ Axios Configuration (`src/api/axiosConfig.js`)

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://80.225.246.52:5137/api",
  // ✅ NO withCredentials - JWT tokens in localStorage only
});

// ✅ Request interceptor: Attach JWT token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Response interceptor: Handle 401 and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 (Unauthorized), clear token and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

export default api;
```

---

## 2️⃣ Login Page (`src/Components/User/Login.jsx`)

```javascript
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Style/userotp.css";
import axios from "axios";

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error when user starts typing
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ✅ NO withCredentials - JWT tokens stored in localStorage only
      const res = await axios.post("http://80.225.246.52:5137/api/login", {
        email: form.email,
        password: form.password,
      });

      // ✅ CASE 1: OTP REQUIRED
      if (res.data.otpRequired) {
        localStorage.setItem("email", form.email);
        navigate("/otp");
      }
      // ✅ CASE 2: DIRECT LOGIN (Token received)
      else if (res.data.accessToken || res.data.token) {
        const token = res.data.accessToken || res.data.token;
        localStorage.setItem("token", token);
        navigate("/dashboard"); // Redirect to dashboard
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again.";
      setError(errorMessage);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="main-container">
      <div className="login-card">
        {/* Left Side */}
        <div className="left-panel">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
            alt="illustration"
          />
        </div>

        {/* Right Side */}
        <div className="right-panel">
          <h2 className="title">Aryan Group</h2>
          <p className="subtitle">Login</p>

          {/* ✅ Error Message Display */}
          {error && (
            <div
              style={{
                backgroundColor: "#f8d7da",
                color: "#721c24",
                padding: "12px",
                borderRadius: "4px",
                marginBottom: "15px",
                border: "1px solid #f5c6cb",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>
                <i className="fa-solid fa-user" style={{ color: "black" }}></i>
                Your Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your Email"
                value={form.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label>
                <i className="fa-solid fa-lock" style={{ color: "black" }}></i>
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <p className="forgot ms-4">
              <Link to="/forgot-password">Forgot your Password?</Link>
            </p>

            <div className="btn-group">
              <button
                type="submit"
                className="login-btn"
                disabled={loading}
                style={{
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
            <div className="create">
              <p className="forgot d-flex fs-6 mt-4 ms-5">
                <Link to="/signup">Create Your Account?</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
```

---

## 3️⃣ Dashboard Page (`src/Components/home/DashboardPage.jsx`)

```javascript
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // ✅ Check if token exists
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    // ✅ Fetch user data from GET /api/user
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Authorization header is automatically added by axios interceptor
        const response = await api.get("/user");
        setUserData(response.data);
        setError("");
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load user data. Please try again.",
        );

        // If 401, token is invalid - redirect to login
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.log("Logout error:", err);
    }
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          fontSize: "18px",
          color: "#666",
        }}
      >
        Loading user data...
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          paddingBottom: "20px",
          borderBottom: "2px solid #e5e7eb",
        }}
      >
        <h1 style={{ margin: 0, color: "#111" }}>Dashboard</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            backgroundColor: "#ff4b2b",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          Logout
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "12px",
            borderRadius: "6px",
            marginBottom: "20px",
            border: "1px solid #f5c6cb",
          }}
        >
          {error}
        </div>
      )}

      {/* Welcome Message */}
      <div
        style={{
          backgroundColor: "#e6f1fb",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "30px",
          borderLeft: "4px solid #185fa5",
        }}
      >
        <h2 style={{ margin: "0 0 10px 0", color: "#185fa5" }}>
          Welcome, {userData?.name || "User"}! 👋
        </h2>
        <p style={{ margin: 0, color: "#555" }}>
          You have successfully logged in. Your authentication token has been
          stored securely in localStorage.
        </p>
      </div>

      {/* User Information */}
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <h3
          style={{
            margin: "0 0 20px 0",
            fontSize: "18px",
            color: "#111",
            borderBottom: "1px solid #e5e7eb",
            paddingBottom: "10px",
          }}
        >
          User Information
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                color: "#888",
                textTransform: "uppercase",
                marginBottom: "5px",
              }}
            >
              Name
            </label>
            <p
              style={{
                margin: 0,
                fontSize: "16px",
                color: "#111",
                fontWeight: 500,
              }}
            >
              {userData?.name || "N/A"}
            </p>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                color: "#888",
                textTransform: "uppercase",
                marginBottom: "5px",
              }}
            >
              Email
            </label>
            <p
              style={{
                margin: 0,
                fontSize: "16px",
                color: "#111",
                fontWeight: 500,
              }}
            >
              {userData?.email || "N/A"}
            </p>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                color: "#888",
                textTransform: "uppercase",
                marginBottom: "5px",
              }}
            >
              Phone
            </label>
            <p
              style={{
                margin: 0,
                fontSize: "16px",
                color: "#111",
                fontWeight: 500,
              }}
            >
              {userData?.phone || "N/A"}
            </p>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                color: "#888",
                textTransform: "uppercase",
                marginBottom: "5px",
              }}
            >
              Role
            </label>
            <p
              style={{
                margin: 0,
                fontSize: "16px",
                color: "#111",
                fontWeight: 500,
                textTransform: "capitalize",
              }}
            >
              {userData?.role || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* JWT Token Info */}
      <div
        style={{
          backgroundColor: "#f0f9ff",
          border: "1px solid #bfdbfe",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        <h3
          style={{
            margin: "0 0 15px 0",
            fontSize: "16px",
            color: "#185fa5",
          }}
        >
          Authentication Status
        </h3>
        <div style={{ fontSize: "14px", color: "#555", lineHeight: "1.6" }}>
          <p style={{ margin: "8px 0" }}>
            <strong>✅ Token Status:</strong> Valid and stored in localStorage
          </p>
          <p style={{ margin: "8px 0" }}>
            <strong>🔐 Token Key:</strong> "token"
          </p>
          <p style={{ margin: "8px 0" }}>
            <strong>📡 API Endpoint:</strong> http://80.225.246.52:5137/api/user
          </p>
          <p style={{ margin: "8px 0" }}>
            <strong>🔒 Authorization:</strong> Bearer token automatically
            attached by axios interceptor
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

## 4️⃣ Protected Route (`src/Components/routes/ProtectedRoute.jsx`)

```javascript
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProtectedRoute() {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsValid(false);
      return;
    }

    // ✅ Token exists, route is protected
    setIsValid(true);
  }, []);

  if (isValid === null) return null; // Loading state

  if (isValid === false) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
```

---

## 5️⃣ App.jsx Routes (Updated)

The following routes have been added to `src/App.jsx`:

```javascript
<Route element={<ProtectedRoute />}>
  {/* ✅ JWT Protected Dashboard Page */}
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/centrallab" element={<CentrallabPage />} />
  <Route path="/project" element={<ProjecPage />} />
  <Route path="/result" element={<DownloadResults />} />
  <Route path="/profile" element={<ProfilePage />} />
  <Route path="/alltrf" element={<AllTestRequests />} />
</Route>
```

---

## 🔄 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   USER VISITS APP                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              CHECK FOR TOKEN IN localStorage                 │
│                  (via ProtectedRoute)                        │
└─────────────────────────────────────────────────────────────┘
        ↙                                              ↘
    NO TOKEN                                      TOKEN EXISTS
        ↓                                              ↓
    SHOW LOGIN PAGE                           SHOW PROTECTED PAGE
    (src/Components/User/Login.jsx)           (e.g., Dashboard)
        ↓                                              ↓
    USER ENTERS EMAIL/PASSWORD                FETCH USER DATA
        ↓                                    (GET /api/user)
    POST /api/login                                  ↓
    (NO withCredentials)                    AXIOS INTERCEPTOR
        ↓                                    ATTACHES TOKEN
    GET accessToken                                  ↓
        ↓                              DISPLAY USER INFORMATION
    STORE IN localStorage                           ↓
    (key: "token")                        USER CAN NAVIGATE
        ↓                                  BETWEEN PAGES
    REDIRECT TO /dashboard                         ↓
        ↓                                  CLICK LOGOUT
    DASHBOARD FETCHES /api/user                     ↓
    (WITH Authorization: Bearer <token>)    CLEAR localStorage
        ↓                                  REDIRECT TO /
    DISPLAY USER DATA                    (Login Page)
        ↓
    USER SEES:
    - Name, Email, Phone, Role
    - Logout Button
    - Authentication Status
```

---

## ✅ All Requirements Completed

- ✅ Login page with email and password input fields
- ✅ POST request to http://80.225.246.52:5137/api/login
- ✅ NO withCredentials in login request
- ✅ JWT token stored in localStorage with key "token"
- ✅ Redirect user to dashboard page on successful login
- ✅ Dashboard page that fetches user data from GET /api/user
- ✅ Authorization header: Authorization: Bearer <token>
- ✅ Redirect back to login if token is missing or invalid
- ✅ Axios for API calls with interceptor
- ✅ Automatic token attachment to every request
- ✅ Error messages for failed login
- ✅ Simple and clean UI

---

**Implementation Status: ✅ COMPLETE AND READY TO USE**
