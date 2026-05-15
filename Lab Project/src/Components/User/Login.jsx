import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";

// Custom hook for responsive breakpoints;
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  React.useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = (e) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);
  return matches;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 768px)");
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

  // Responsive overrides
  const responsiveInnerContainer = {
    ...styles.innerContainer,
    flexDirection: isMobile ? "column" : "row",
    maxWidth: isMobile ? "450px" : "900px",
    borderRadius: isMobile ? "24px" : "20px",
  };

  const responsiveLeftPanel = {
    ...styles.leftPanel,
    padding: isMobile ? "32px 24px" : "48px 44px",
    minHeight: isMobile ? "auto" : "560px",
  };

  const responsiveRightPanel = {
    ...styles.rightPanel,
    padding: isMobile ? "32px 24px" : "48px",
  };

  const responsiveTitle = {
    ...styles.title,
    fontSize: isMobile ? "28px" : "34px",
  };

  const responsiveStatsContainer = {
    ...styles.statsContainer,
    gap: isMobile ? "20px" : "32px",
  };

  const responsiveStatNumber = {
    ...styles.statNumber,
    fontSize: isMobile ? "20px" : "22px",
  };

  const responsiveStatLabel = {
    ...styles.statLabel,
    fontSize: isMobile ? "10px" : "11px",
  };

  const responsiveLeftBigLetter = {
    ...styles.leftBigLetter,
    fontSize: isMobile ? "70px" : "96px",
    top: isMobile ? "12px" : "28px",
    left: isMobile ? "20px" : "36px",
  };

  const responsiveTagPill = {
    ...styles.tagPill,
    fontSize: isMobile ? "10px" : "11px",
    padding: isMobile ? "4px 12px" : "6px 14px",
    marginBottom: isMobile ? "16px" : "20px",
  };

  const responsiveSubtext = {
    ...styles.subtext,
    fontSize: isMobile ? "12px" : "13px",
    maxWidth: isMobile ? "100%" : "260px",
    marginBottom: isMobile ? "20px" : "24px",
  };

  const responsiveWelcomeTitle = {
    ...styles.welcomeTitle,
    fontSize: isMobile ? "24px" : "28px",
  };

  const responsiveWelcomeSub = {
    ...styles.welcomeSub,
    fontSize: isMobile ? "12px" : "13px",
    marginBottom: isMobile ? "28px" : "32px",
  };

  const responsiveInput = {
    ...styles.input,
    height: isMobile ? "42px" : "46px",
    fontSize: isMobile ? "13px" : "14px",
  };

  const responsiveSubmitBtn = {
    ...styles.submitBtn,
    height: isMobile ? "44px" : "48px",
    fontSize: isMobile ? "13px" : "14px",
  };

  const responsiveActionsRow = {
    ...styles.actionsRow,
    flexDirection: isMobile ? "column" : "row",
    alignItems: isMobile ? "flex-start" : "center",
    gap: isMobile ? "12px" : "0",
    marginBottom: isMobile ? "24px" : "28px",
  };

  return (
    <>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      <div style={styles.pageContainer}>
        <div style={responsiveInnerContainer}>
          {/* LEFT DARK PANEL */}
          <div style={responsiveLeftPanel}>
            <div style={styles.leftDecor1} />
            <div style={styles.leftDecor2} />
            <span style={responsiveLeftBigLetter}>A</span>
            <div style={styles.leftContent}>
              <div style={responsiveTagPill}>
                <span style={styles.tagDot} />
                Enterprise Portal
              </div>
              <h1 style={responsiveTitle}>
                Aryan Group<br />of Companies
              </h1>
              <p style={responsiveSubtext}>
                Streamlined access to your workspace, tools, and resources.
              </p>
              <div style={styles.divider} />
              <div style={responsiveStatsContainer}>
                {[["12+", "Divisions"], ["500+", "Employees"], ["24/7", "Support"]].map(([num, lbl]) => (
                  <div key={lbl}>
                    <span style={responsiveStatNumber}>{num}</span>
                    <span style={responsiveStatLabel}>{lbl}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT WHITE PANEL (FORM) */}
          <div style={responsiveRightPanel}>
            <div style={styles.topBar}>
              <div style={styles.logoWrapper}>
                <div style={styles.logoBox}>A</div>
                <span style={styles.logoText}>Aryan Group</span>
              </div>
              <span style={styles.secureLabel}>Secure Login</span>
            </div>

            <h2 style={responsiveWelcomeTitle}>Welcome back</h2>
            <p style={responsiveWelcomeSub}>Sign in to access your account</p>

            {errors.general && (
              <div style={styles.generalError}>{errors.general}</div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>
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
                  style={{ ...responsiveInput, borderColor: errors.email ? "#e74c3c" : "rgba(0,0,0,0.1)", background: errors.email ? "#fff9f9" : "#fafafa" }}
                />
                {errors.email && <p style={styles.errorText}>{errors.email}</p>}
              </div>

              {/* Password */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.45 }}>
                    <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  Password
                </label>
                <div style={styles.passwordWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="off"
                    style={{ ...responsiveInput, borderColor: errors.password ? "#e74c3c" : "rgba(0,0,0,0.1)", background: errors.password ? "#fff9f9" : "#fafafa", paddingRight: "44px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
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
                {errors.password && <p style={styles.errorText}>{errors.password}</p>}
              </div>

              {/* Remember & Forgot */}
              <div style={responsiveActionsRow}>
                <div onClick={() => setRemember(!remember)} style={styles.rememberCheck}>
                  <div style={styles.checkbox}>
                    {remember && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span style={styles.rememberText}>Remember me</span>
                </div>
                <Link to="/forgot-password" style={styles.forgotLink}>Forgot password?</Link>
              </div>

              <button type="submit" style={responsiveSubmitBtn}>
                Sign In
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>

            <div style={styles.dividerOr}>
              <span style={styles.dividerLine} />
              <span style={styles.orText}>or</span>
              <span style={styles.dividerLine} />
            </div>

            <p style={styles.signupText}>
              New to Aryan Group?{" "}
              <Link to="/signup" style={styles.signupLink}>Signup</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

// Base styles (unchanged)
const styles = {
  pageContainer: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f4f4f2",
    padding: "24px",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    boxSizing: "border-box",
  },
  innerContainer: {
    display: "flex",
    width: "100%",
    minHeight: "560px",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
  },
  leftPanel: {
    flex: "1.1",
    background: "#0f0f0f",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    position: "relative",
    overflow: "hidden",
  },
  leftDecor1: {
    position: "absolute",
    width: "340px",
    height: "340px",
    borderRadius: "50%",
    border: "0.5px solid rgba(255,255,255,0.07)",
    top: "-80px",
    left: "-80px",
    pointerEvents: "none",
  },
  leftDecor2: {
    position: "absolute",
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    border: "0.5px solid rgba(255,255,255,0.05)",
    top: "60px",
    right: "-40px",
    pointerEvents: "none",
  },
  leftBigLetter: {
    fontFamily: "'Playfair Display', serif",
    fontWeight: 600,
    color: "rgba(255,255,255,0.06)",
    position: "absolute",
    lineHeight: 1,
    letterSpacing: "-4px",
    userSelect: "none",
    pointerEvents: "none",
  },
  leftContent: {
    position: "relative",
    zIndex: 1,
  },
  tagPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    background: "rgba(255,255,255,0.08)",
    border: "0.5px solid rgba(255,255,255,0.12)",
    borderRadius: "100px",
    color: "rgba(255,255,255,0.55)",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontWeight: 500,
  },
  tagDot: {
    width: "6px",
    height: "6px",
    background: "#fff",
    borderRadius: "50%",
    opacity: 0.7,
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontWeight: 600,
    color: "#ffffff",
    lineHeight: 1.25,
    margin: "0 0 14px 0",
  },
  subtext: {
    color: "rgba(255,255,255,0.45)",
    fontWeight: 300,
    lineHeight: 1.7,
    margin: "0 0 24px 0",
  },
  divider: {
    width: "32px",
    height: "1px",
    background: "rgba(255,255,255,0.2)",
    marginBottom: "24px",
  },
  statsContainer: {
    display: "flex",
  },
  statNumber: {
    display: "block",
    fontFamily: "'Playfair Display', serif",
    color: "#fff",
    fontWeight: 600,
  },
  statLabel: {
    display: "block",
    color: "rgba(255,255,255,0.35)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginTop: "2px",
  },
  rightPanel: {
    flex: 1,
    background: "#ffffff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "44px",
  },
  logoWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoBox: {
    width: "30px",
    height: "30px",
    background: "#0f0f0f",
    borderRadius: "7px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Playfair Display', serif",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 600,
  },
  logoText: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "15px",
    color: "#0f0f0f",
    fontWeight: 600,
  },
  secureLabel: {
    fontSize: "11px",
    color: "rgba(0,0,0,0.35)",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  welcomeTitle: {
    fontFamily: "'Playfair Display', serif",
    fontWeight: 600,
    color: "#0f0f0f",
    margin: "0 0 6px 0",
    lineHeight: 1.2,
  },
  welcomeSub: {
    color: "rgba(0,0,0,0.45)",
    fontWeight: 300,
    margin: "0 0 32px 0",
  },
  generalError: {
    background: "#fff2f2",
    border: "0.5px solid #f5c6c6",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "13px",
    color: "#c0392b",
    marginBottom: "20px",
  },
  fieldGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "11px",
    fontWeight: 500,
    color: "rgba(0,0,0,0.5)",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    border: "1px solid rgba(0,0,0,0.1)",
    borderRadius: "10px",
    padding: "0 16px",
    fontFamily: "'DM Sans', sans-serif",
    color: "#0f0f0f",
    background: "#fafafa",
    outline: "none",
    boxSizing: "border-box",
  },
  passwordWrapper: {
    position: "relative",
  },
  eyeButton: {
    position: "absolute",
    right: "13px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
    opacity: 0.45,
    display: "flex",
    alignItems: "center",
  },
  errorText: {
    fontSize: "11px",
    color: "#c0392b",
    margin: "5px 0 0 0",
  },
  actionsRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "4px 0 28px 0",
  },
  rememberCheck: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    userSelect: "none",
  },
  checkbox: {
    width: "16px",
    height: "16px",
    border: "1px solid rgba(0,0,0,0.2)",
    borderRadius: "4px",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  rememberText: {
    fontSize: "12px",
    color: "rgba(0,0,0,0.45)",
  },
  forgotLink: {
    fontSize: "12px",
    color: "rgba(0,0,0,0.5)",
    textDecoration: "none",
  },
  submitBtn: {
    width: "100%",
    background: "#0f0f0f",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    letterSpacing: "0.02em",
  },
  dividerOr: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "24px 0",
  },
  dividerLine: {
    flex: 1,
    height: "0.5px",
    background: "rgba(0,0,0,0.1)",
  },
  orText: {
    fontSize: "11px",
    color: "rgba(0,0,0,0.3)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  signupText: {
    textAlign: "center",
    fontSize: "13px",
    color: "rgba(0,0,0,0.4)",
    margin: 0,
  },
  signupLink: {
    color: "#0f0f0f",
    fontWeight: 500,
    textDecoration: "underline",
    textUnderlineOffset: "2px",
  },
};