import { useNavigate, useParams, useLocation,Link } from "react-router-dom";
import { useState } from "react";
import api from "../../api/axiosConfig";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Get token from URL query params
  const query = new URLSearchParams(window.location.search);
  const token = query.get("session");

  async function handleReset(e) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }


    try {
      let res = await api.post("/reset-password", {
        token: token,
        newPassword: newPassword,
      });

      alert(res.data.message);

      navigate("/"); // 🔥 login page
    } catch (err) {
      alert(err.response?.data?.message);
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
        width: "100%",
        maxWidth: "500px",
        background: "#ffffff",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
      }}>

        {/* White Panel - Full Width */}
        <div style={{
          padding: "48px",
        }}>

          {/* Top bar */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "44px",
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
            }}>Reset Password</span>
          </div>

          {/* Heading */}
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "28px", fontWeight: 600,
            color: "#0f0f0f", margin: "0 0 6px 0", lineHeight: 1.2,
          }}>Create new password</h2>
          <p style={{
            fontSize: "13px", color: "rgba(0,0,0,0.45)",
            fontWeight: 300, margin: "0 0 32px 0",
          }}>Your new password must be different from previous ones</p>

          {/* Error message */}
          {error && (
            <div style={{
              background: "#fff2f2", border: "0.5px solid #f5c6c6",
              borderRadius: "8px", padding: "10px 14px",
              fontSize: "13px", color: "#c0392b", marginBottom: "20px",
            }}>{error}</div>
          )}

          <form onSubmit={handleReset} noValidate>

            {/* ── New Password ── */}
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
                New Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError("");
                  }}
                  required
                  style={{
                    width: "100%", height: "46px",
                    border: error ? "1px solid #e74c3c" : "1px solid rgba(0,0,0,0.1)",
                    borderRadius: "10px", padding: "0 44px 0 16px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "14px", color: "#0f0f0f",
                    background: "#fafafa",
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
            </div>

            {/* ── Confirm Password ── */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{
                display: "flex", alignItems: "center", gap: "6px",
                fontSize: "11px", fontWeight: 500, color: "rgba(0,0,0,0.5)",
                textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "8px",
              }}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.45 }}>
                  <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                Confirm Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  required
                  style={{
                    width: "100%", height: "46px",
                    border: error ? "1px solid #e74c3c" : "1px solid rgba(0,0,0,0.1)",
                    borderRadius: "10px", padding: "0 44px 0 16px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "14px", color: "#0f0f0f",
                    background: "#fafafa",
                    outline: "none", boxSizing: "border-box",
                  }}
                />
                {/* Eye toggle */}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                  style={{
                    position: "absolute", right: "13px", top: "50%",
                    transform: "translateY(-50%)",
                    background: "none", border: "none", padding: 0,
                    cursor: "pointer", opacity: 0.45,
                    display: "flex", alignItems: "center",
                  }}
                >
                  {showConfirmPassword ? (
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
            </div>

            {/* Password requirements hint */}
            <div style={{
              fontSize: "11px", color: "rgba(0,0,0,0.4)",
              marginTop: "-12px", marginBottom: "28px",
            }}>
              • Minimum 6 characters
            </div>

            {/* ── Submit Button ── */}
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
              Reset Password
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

          </form>

          {/* ── Divider ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "28px 0 20px" }}>
            <span style={{ flex: 1, height: "0.5px", background: "rgba(0,0,0,0.1)" }} />
            <span style={{
              fontSize: "11px", color: "rgba(0,0,0,0.3)",
              textTransform: "uppercase", letterSpacing: "0.06em",
            }}>or</span>
            <span style={{ flex: 1, height: "0.5px", background: "rgba(0,0,0,0.1)" }} />
          </div>

          {/* ── Back to Login link ── */}
          <p style={{ textAlign: "center", fontSize: "13px", color: "rgba(0,0,0,0.4)", margin: 0 }}>
            Remember your password?{" "}
            <Link to="/" style={{
              color: "#0f0f0f", fontWeight: 500,
              textDecoration: "underline", textUnderlineOffset: "2px",
            }}>Back to Login</Link>
          </p>

        </div>
      </div>
    </div>
  );
}