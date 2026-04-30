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
