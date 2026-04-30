# JWT Authentication Setup - Complete Implementation Guide

This document explains the complete JWT authentication system that has been implemented for your React Vite application.

---

## 📋 Overview

✅ **What's Implemented:**

- Login page with email/password authentication
- JWT token storage in localStorage
- Automatic token attachment to all API requests via axios interceptor
- Protected routes that redirect to login if token is missing
- Dashboard page that fetches user data with Authorization header
- Automatic redirect on 401 (unauthorized) response
- Error handling and user feedback
- Logout functionality

---

## 🔧 Configuration Files

### 1. Axios Configuration (`src/api/axiosConfig.js`)

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

**Key Features:**

- No `withCredentials` (as per requirements)
- Automatically adds `Authorization: Bearer <token>` header to every request
- Handles 401 errors by clearing token and redirecting to login
- Request/response interceptors are transparent to components

---

## 🔐 Login Page (`src/Components/User/Login.jsx`)

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
      {/* ... JSX with error display and form ... */}
    </div>
  );
}
```

**Key Features:**

- ✅ No `withCredentials` in login request
- Email and password inputs with validation
- Error message display on failed login
- Loading state during request
- Stores JWT token in localStorage with key "token"
- Redirects to `/dashboard` on successful login
- Handles OTP flow if required by backend

---

## 📊 Dashboard Page (`src/Components/home/DashboardPage.jsx`)

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

  // ... JSX for displaying user data ...
}
```

**Key Features:**

- ✅ Checks for token on mount - redirects to login if missing
- ✅ Fetches user data from `GET /api/user` endpoint
- ✅ Authorization header automatically attached by axios interceptor
- Displays user information (name, email, phone, role)
- Handles 401 errors by clearing token and redirecting
- Logout button that clears localStorage and redirects to login
- Loading and error states with user feedback

---

## 🛡️ Protected Route (`src/Components/routes/ProtectedRoute.jsx`)

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

**Key Features:**

- ✅ Redirects to login page (`/`) if token is missing
- ✅ Allows access if token exists
- Loading state to prevent flash of content

---

## 🔄 Routing Setup (`src/App.jsx`)

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

**Public Routes:**

- `/` - Login page
- `/signup` - Signup page
- `/otp` - OTP verification
- `/forgot-password` - Password recovery
- `/reset-password` - Password reset

**Protected Routes (require valid JWT token):**

- `/dashboard` - User dashboard (new)
- `/centrallab` - Central lab page
- `/project` - Project page
- `/result` - Results page
- `/profile` - User profile page
- `/alltrf` - All test requests

---

## 🌊 Authentication Flow

### Login Flow:

```
1. User enters email/password
   ↓
2. POST /api/login (NO withCredentials)
   ↓
3. Backend returns:
   - accessToken/token → Store in localStorage
   - otpRequired: true → Redirect to /otp
   ↓
4. Navigate to /dashboard
   ↓
5. Dashboard fetches GET /api/user
   ↓
6. Axios interceptor automatically adds:
   Authorization: Bearer <token>
   ↓
7. Display user data
```

### Protected Route Flow:

```
1. User navigates to protected route
   ↓
2. ProtectedRoute checks localStorage for token
   ↓
3. If token missing → Redirect to / (login)
   ↓
4. If token exists → Render component
   ↓
5. Component makes API requests
   ↓
6. Axios interceptor adds Authorization header
   ↓
7. If 401 response → Clear token and redirect to login
```

---

## 📦 API Endpoints

### Login

```
POST /api/login
Body: { email, password }
Response: { accessToken/token, otpRequired? }
```

### Get User Data

```
GET /api/user
Headers: Authorization: Bearer <token>
Response: { name, email, phone, role, ... }
```

### Logout (Optional)

```
POST /api/logout
Headers: Authorization: Bearer <token>
```

---

## 🔒 Security Features Implemented

✅ **Token Storage:**

- JWT token stored in localStorage with key "token"
- No cookies used (no withCredentials)

✅ **Token Attachment:**

- Automatic attachment via axios request interceptor
- Applied to all API requests

✅ **Error Handling:**

- 401 responses trigger logout and redirect to login
- Error messages displayed to user
- Console logging for debugging

✅ **Protected Routes:**

- Components wrapped with `<ProtectedRoute />`
- Missing token redirects to login
- Route guards prevent unauthorized access

✅ **Logout:**

- Clears localStorage
- Redirects to login page
- Optional backend logout call

---

## 🚀 How to Use

### After Login (from Login page):

1. User enters credentials
2. JWT token automatically stored
3. User redirected to `/dashboard`
4. Dashboard fetches and displays user data
5. All API requests automatically include Authorization header

### Navigate Between Protected Pages:

1. User can navigate between any protected routes
2. JWT token remains in localStorage
3. All requests automatically include the token
4. If token expires (401 response), user is logged out and redirected

### Logout:

1. Click logout button
2. Token is cleared from localStorage
3. User is redirected to login page
4. All subsequent requests won't include Authorization header

---

## ✅ Verification Checklist

- ✅ Login page with email/password inputs
- ✅ POST request to `/api/login` without withCredentials
- ✅ JWT token stored in localStorage with key "token"
- ✅ Redirect to `/dashboard` on successful login
- ✅ Dashboard fetches user data from `GET /api/user`
- ✅ Authorization header automatically attached
- ✅ Protected routes redirect to login if token missing
- ✅ 401 response triggers logout and redirect
- ✅ Error messages displayed to user
- ✅ Logout functionality clears token
- ✅ Axios interceptor configured
- ✅ Simple and clean UI

---

## 📝 Notes

- The axios config is imported as `api` and used in Dashboard and other protected components
- The regular `axios` is used in Login.jsx for the login request (not using interceptor)
- Token is checked on route load using ProtectedRoute wrapper
- Error responses are properly handled and displayed
- Loading states prevent UI flashing
- All requirements have been met

---

## 🔗 File Locations

- Axios Config: `src/api/axiosConfig.js`
- Login Page: `src/Components/User/Login.jsx`
- Dashboard Page: `src/Components/home/DashboardPage.jsx` (NEW)
- Protected Route: `src/Components/routes/ProtectedRoute.jsx`
- Main App: `src/App.jsx`

---

**Status: ✅ COMPLETE - All requirements implemented and ready to use!**
