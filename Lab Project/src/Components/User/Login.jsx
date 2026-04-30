import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Style/userotp.css";
import api from "../../api/axiosConfig";

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
      // ✅ Using configured api instance with base URL
      const res = await api.post("/login", {
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
        navigate("/centrallab"); // Redirect to dashboard
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
