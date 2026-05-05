import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "", general: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "", general: "" });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      //  Using configured api instance with base URL
      const res = await api.post("/login", 
        { email: form.email, password: form.password },
        { withCredentials: true}
      );

     if (res.data.otpRequired) {
        localStorage.setItem("email", form.email);
        navigate("/otp");
      } else {
        localStorage.setItem("token", res.data.accessToken);
        navigate("/centrallab");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      if (errorMessage.toLowerCase().includes("email") || errorMessage.toLowerCase().includes("not found")) {
        setErrors({ ...errors, email: errorMessage, password: "", general: "" });
      } else if (errorMessage.toLowerCase().includes("password")) {
        setErrors({ ...errors, password: errorMessage, email: "", general: "" });
      } else {
        setErrors({ ...errors, general: errorMessage, email: "", password: "" });
      }
    }
  }

 
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f4f4f2",
      padding: "24px",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      boxSizing: "border-box",
    }}>

      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      <div style={{
        display: "flex",
        width: "100%",
        maxWidth: "900px",
        minHeight: "560px",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
      }}>

        {/* ══════════════════════════════
            LEFT DARK PANEL
        ══════════════════════════════ */}
        <div style={{
          flex: "1.1",
          background: "#0f0f0f",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "48px 44px",
          position: "relative",
          overflow: "hidden",
        }}>

          {/* Decorative circle 1 */}
          <div style={{
            position: "absolute", width: "340px", height: "340px",
            borderRadius: "50%", border: "0.5px solid rgba(255,255,255,0.07)",
            top: "-80px", left: "-80px", pointerEvents: "none",
          }} />

          {/* Decorative circle 2 */}
          <div style={{
            position: "absolute", width: "200px", height: "200px",
            borderRadius: "50%", border: "0.5px solid rgba(255,255,255,0.05)",
            top: "60px", right: "-40px", pointerEvents: "none",
          }} />

          {/* Large background letter */}
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "96px", fontWeight: 600,
            color: "rgba(255,255,255,0.06)",
            position: "absolute", top: "28px", left: "36px",
            lineHeight: 1, letterSpacing: "-4px",
            userSelect: "none", pointerEvents: "none",
          }}>A</span>

          {/* Left content */}
          <div style={{ position: "relative", zIndex: 1 }}>

            {/* Tag pill */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "7px",
              background: "rgba(255,255,255,0.08)",
              border: "0.5px solid rgba(255,255,255,0.12)",
              borderRadius: "100px", padding: "6px 14px",
              fontSize: "11px", color: "rgba(255,255,255,0.55)",
              letterSpacing: "0.08em", textTransform: "uppercase",
              fontWeight: 500, marginBottom: "20px",
            }}>
              <span style={{
                width: "6px", height: "6px",
                background: "#fff", borderRadius: "50%", opacity: 0.7,
              }} />
              Enterprise Portal
            </div>

            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "34px", fontWeight: 600,
              color: "#ffffff", lineHeight: 1.25,
              margin: "0 0 14px 0",
            }}>
              Aryan Group<br />of Companies
            </h1>

            <p style={{
              fontSize: "13px", color: "rgba(255,255,255,0.45)",
              fontWeight: 300, lineHeight: 1.7,
              maxWidth: "260px", margin: "0 0 24px 0",
            }}>
              Streamlined access to your workspace, tools, and resources.
            </p>

            {/* Divider line */}
            <div style={{
              width: "32px", height: "1px",
              background: "rgba(255,255,255,0.2)",
              marginBottom: "24px",
            }} />

            {/* Stats */}
            <div style={{ display: "flex", gap: "32px" }}>
              {[["12+", "Divisions"], ["500+", "Employees"], ["24/7", "Support"]].map(([num, lbl]) => (
                <div key={lbl}>
                  <span style={{
                    display: "block",
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "22px", color: "#fff", fontWeight: 600,
                  }}>{num}</span>
                  <span style={{
                    display: "block", fontSize: "11px",
                    color: "rgba(255,255,255,0.35)",
                    textTransform: "uppercase", letterSpacing: "0.06em", marginTop: "2px",
                  }}>{lbl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════
            RIGHT WHITE PANEL
        ══════════════════════════════ */}
        <div style={{
          flex: 1, background: "#ffffff",
          padding: "48px", display: "flex",
          flexDirection: "column", justifyContent: "center",
        }}>

          {/* Top bar */}
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between", marginBottom: "44px",
          }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "30px", height: "30px", background: "#0f0f0f",
                borderRadius: "7px", display: "flex",
                alignItems: "center", justifyContent: "center",
                fontFamily: "'Playfair Display', serif",
                color: "#fff", fontSize: "14px", fontWeight: 600,
              }}>A</div>
              <span style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "15px", color: "#0f0f0f", fontWeight: 600,
              }}>Aryan Group</span>
            </div>
            <span style={{
              fontSize: "11px", color: "rgba(0,0,0,0.35)",
              letterSpacing: "0.06em", textTransform: "uppercase",
            }}>Secure Login</span>
          </div>

          {/* Heading */}
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "28px", fontWeight: 600,
            color: "#0f0f0f", margin: "0 0 6px 0", lineHeight: 1.2,
          }}>Welcome back</h2>
          <p style={{
            fontSize: "13px", color: "rgba(0,0,0,0.45)",
            fontWeight: 300, margin: "0 0 32px 0",
          }}>Sign in to access your account</p>

          {/* General error */}
          {errors.general && (
            <div style={{
              background: "#fff2f2", border: "0.5px solid #f5c6c6",
              borderRadius: "8px", padding: "10px 14px",
              fontSize: "13px", color: "#c0392b", marginBottom: "20px",
            }}>{errors.general}</div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            {/* ── Email ── */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "flex", alignItems: "center", gap: "6px",
                fontSize: "11px", fontWeight: 500, color: "rgba(0,0,0,0.5)",
                textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "8px",
              }}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.45 }}>
                  <circle cx="8" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                Email address
              </label>
              <input
                type="text"
                name="email"
                placeholder="you@aryangroup.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="off"
                style={{
                  width: "100%", height: "46px",
                  border: errors.email ? "1px solid #e74c3c" : "1px solid rgba(0,0,0,0.1)",
                  borderRadius: "10px", padding: "0 16px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "14px", color: "#0f0f0f",
                  background: errors.email ? "#fff9f9" : "#fafafa",
                  outline: "none", boxSizing: "border-box",
                }}
              />
              {errors.email && (
                <p style={{ fontSize: "11px", color: "#c0392b", margin: "5px 0 0 0" }}>{errors.email}</p>
              )}
            </div>

            {/* ── Password ── */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "flex", alignItems: "center", gap: "6px",
                fontSize: "11px", fontWeight: 500, color: "rgba(0,0,0,0.5)",
                textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "8px",
              }}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.45 }}>
                  <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="off"
                  style={{
                    width: "100%", height: "46px",
                    border: errors.password ? "1px solid #e74c3c" : "1px solid rgba(0,0,0,0.1)",
                    borderRadius: "10px", padding: "0 44px 0 16px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "14px", color: "#0f0f0f",
                    background: errors.password ? "#fff9f9" : "#fafafa",
                    outline: "none", boxSizing: "border-box",
                  }}
                />
                {/* Eye toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  style={{
                    position: "absolute", right: "13px", top: "50%",
                    transform: "translateY(-50%)",
                    background: "none", border: "none", padding: 0,
                    cursor: "pointer", opacity: 0.45,
                    display: "flex", alignItems: "center",
                  }}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <path d="M3 3l14 14M8.5 8.6a2.5 2.5 0 003.4 3.4" stroke="#888" strokeWidth="1.3" strokeLinecap="round" />
                      <path d="M4.3 6.5C2.6 7.8 1.5 9.3 1.5 10s2.7 5 8.5 5c1.5 0 2.8-.3 4-.8M7 4.3C7.9 4.1 8.9 4 10 4c5.8 0 8.5 4.3 8.5 5s-.8 1.9-2.3 3" stroke="#888" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <ellipse cx="10" cy="10" rx="8.5" ry="5" stroke="#888" strokeWidth="1.3" />
                      <circle cx="10" cy="10" r="2.5" stroke="#888" strokeWidth="1.3" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p style={{ fontSize: "11px", color: "#c0392b", margin: "5px 0 0 0" }}>{errors.password}</p>
              )}
            </div>

            {/* ── Remember + Forgot ── */}
            <div style={{
              display: "flex", alignItems: "center",
              justifyContent: "space-between", margin: "4px 0 28px 0",
            }}>
              <div
                onClick={() => setRemember(!remember)}
                style={{
                  display: "flex", alignItems: "center",
                  gap: "8px", cursor: "pointer", userSelect: "none",
                }}
              >
                <div style={{
                  width: "16px", height: "16px",
                  border: remember ? "1px solid #0f0f0f" : "1px solid rgba(0,0,0,0.2)",
                  borderRadius: "4px",
                  background: remember ? "#0f0f0f" : "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {remember && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: "12px", color: "rgba(0,0,0,0.45)" }}>Remember me</span>
              </div>

              <Link to="/forgot-password" style={{
                fontSize: "12px", color: "rgba(0,0,0,0.5)", textDecoration: "none",
              }}>Forgot password?</Link>
            </div>

            {/* ── Submit ── */}
            <button
              type="submit"
              style={{
                width: "100%", height: "48px",
                background: "#0f0f0f", color: "#fff",
                border: "none", borderRadius: "10px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px", fontWeight: 500,
                cursor: "pointer", display: "flex",
                alignItems: "center", justifyContent: "center",
                gap: "10px", letterSpacing: "0.02em",
              }}
            >
              Sign In
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

          </form>

          {/* ── Divider ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" }}>
            <span style={{ flex: 1, height: "0.5px", background: "rgba(0,0,0,0.1)" }} />
            <span style={{
              fontSize: "11px", color: "rgba(0,0,0,0.3)",
              textTransform: "uppercase", letterSpacing: "0.06em",
            }}>or</span>
            <span style={{ flex: 1, height: "0.5px", background: "rgba(0,0,0,0.1)" }} />
          </div>

          {/* ── Sign up link ── */}
          <p style={{ textAlign: "center", fontSize: "13px", color: "rgba(0,0,0,0.4)", margin: 0 }}>
            New to Aryan Group?{" "}
            <Link to="/signup" style={{
              color: "#0f0f0f", fontWeight: 500,
              textDecoration: "underline", textUnderlineOffset: "2px",
            }}>Signup</Link>
          </p>

        </div>
      </div>
    </div>
  );
}