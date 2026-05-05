import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";

export default function OTPPage() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [resendActive, setResendActive] = useState(false);

  const inputsRef = useRef([]);

  // ⏳ TIMER
  useEffect(() => {
    if (timeLeft === 0) {
      setResendActive(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // 📲 AUTO OTP READ (optional)
   useEffect(() => {
    if ("OTPCredential" in window) {
      const ac = new AbortController();
      navigator.credentials
        .get({ otp: { transport: ["sms"] }, signal: ac.signal })
        .then((otpData) => {
          if (otpData && otpData.code) {
            const code = otpData.code.split("");
            setOtp(code);
          }
        })
        .catch(() => {});
      return () => ac.abort();
    }
  }, []);

  // 🔤 INPUT CHANGE
  function handleChange(value, index) {
    if (isNaN(value)) return;

    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  }

  // ⌫ BACKSPACE
  function handleKeyDown(e, index) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  }

  // 📋 PASTE
   function handlePaste(e) {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pasteData)) return;
    const otpArray = pasteData.slice(0, 6).split("");
    const newOtp = ["", "", "", "", "", ""];
    otpArray.forEach((val, i) => { newOtp[i] = val; });
    setOtp(newOtp);
    const lastIndex = otpArray.length - 1;
    if (lastIndex >= 0) inputsRef.current[lastIndex].focus();
  }


  // 🚀 AUTO VERIFY
  useEffect(() => {
    if (otp.every((digit) => digit !== "")) {
      handleVerify();
    }
  }, [otp]);

  async function handleVerify() {
    try {
      let res = await api.post(
        "/verify-otp",
        {
          email: localStorage.getItem("email"),
          otp: otp.join(""),
        },
        {
          withCredentials: true, // 🔥 VERY IMPORTANT
        },
      );

      // 🔥 TOKEN SAVE (already correct)
      console.log("res.data", res.data);

      localStorage.setItem("token", res.data.token);

      // 🔥 ROLE DECODE
      const decoded = jwtDecode(res.data.token);

      alert(res.data.message);

      // 🔥 ROLE BASED REDIRECT
      if (decoded.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/centrallab"); // ya /lab
      }
    } catch (err) {
      alert(err.response?.data?.message);
    }
  }

  // 🔁 RESEND OTP (MAIN LOGIC)
  async function handleResend() {
    if (!resendActive) return;

    try {
      let res = await api.post("/resend-otp", {
        email: localStorage.getItem("email"),
      });

      alert(res.data.message);

      setTimeLeft(60);
      setResendActive(false);
      setOtp(["", "", "", "", "", ""]);
    } catch (err) {
      alert(err.response?.data?.message);
    }
  }

   const email = localStorage.getItem("email") || "";
  const maskedEmail = email
    ? email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + "*".repeat(Math.min(b.length, 5)) + c)
    : "your email";

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const progress = ((60 - timeLeft) / 60) * 100;
  const strokeDash = circumference - (progress / 100) * circumference;


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

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');

        .otp-box-input {
          width: 52px !important;
          height: 60px !important;
          border-radius: 12px !important;
          border: 1.5px solid rgba(0,0,0,0.1) !important;
          background: #fafafa !important;
          font-family: 'Playfair Display', serif !important;
          font-size: 24px !important;
          font-weight: 600 !important;
          color: #0f0f0f !important;
          text-align: center !important;
          outline: none !important;
          transition: border-color 0.2s, background 0.2s, transform 0.15s !important;
          caret-color: transparent !important;
          box-sizing: border-box !important;
        }
        .otp-box-input:focus {
          border-color: #0f0f0f !important;
          background: #fff !important;
          transform: scale(1.08) !important;
        }
        .otp-box-input.filled {
          border-color: #0f0f0f !important;
          background: #0f0f0f !important;
          color: #fff !important;
        }

        .otp-verify-btn {
          width: 100%;
          height: 48px;
          background: #0f0f0f;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          letter-spacing: 0.02em;
          transition: opacity 0.2s, transform 0.1s;
        }
        .otp-verify-btn:hover  { opacity: 0.85; }
        .otp-verify-btn:active { transform: scale(0.985); }

        .otp-resend-active {
          color: #0f0f0f !important;
          font-weight: 500 !important;
          cursor: pointer !important;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .otp-resend-disabled {
          color: rgba(0,0,0,0.3) !important;
          cursor: not-allowed !important;
        }
      `}</style>

      {/* ── White Card (no dark panel) ── */}
      <div style={{
        width: "100%",
        maxWidth: "480px",
        background: "#ffffff",
        borderRadius: "20px",
        padding: "48px 44px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.10)",
        boxSizing: "border-box",
      }}>

        {/* Top bar */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", marginBottom: "40px",
        }}>
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
          }}>OTP Verification</span>
        </div>

        {/* Shield icon */}
        <div style={{
          width: "56px", height: "56px",
          background: "#f4f4f2",
          border: "0.5px solid rgba(0,0,0,0.08)",
          borderRadius: "14px",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "20px",
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L4 6v6c0 4.4 3.4 8.5 8 9.5 4.6-1 8-5.1 8-9.5V6l-8-4z"
              stroke="#0f0f0f" strokeWidth="1.4" strokeLinejoin="round"/>
            <path d="M9 12l2 2 4-4"
              stroke="#0f0f0f" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Heading */}
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "26px", fontWeight: 600,
          color: "#0f0f0f", margin: "0 0 6px 0", lineHeight: 1.2,
        }}>Enter your OTP</h2>
        <p style={{
          fontSize: "13px", color: "rgba(0,0,0,0.45)",
          fontWeight: 300, margin: "0 0 32px 0", lineHeight: 1.6,
        }}>
          A 6-digit code was sent to{" "}
          <span style={{ color: "#0f0f0f", fontWeight: 500 }}>{maskedEmail}</span>
        </p>

        {/* OTP Inputs */}
        <div style={{
          display: "flex", gap: "10px",
          justifyContent: "center", marginBottom: "28px",
        }}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className={`otp-box-input${digit ? " filled" : ""}`}
            />
          ))}
        </div>

        {/* Timer + Resend */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", marginBottom: "28px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="44" height="44" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r={radius} fill="none"
                stroke="rgba(0,0,0,0.06)" strokeWidth="3" />
              <circle cx="24" cy="24" r={radius} fill="none"
                stroke={timeLeft <= 10 ? "#e74c3c" : "#0f0f0f"}
                strokeWidth="3"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDash}
                strokeLinecap="round"
                transform="rotate(-90 24 24)"
                style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
              />
              <text x="24" y="28" textAnchor="middle"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "11px", fontWeight: 500,
                  fill: timeLeft <= 10 ? "#e74c3c" : "#0f0f0f",
                }}>
                {timeLeft}s
              </text>
            </svg>
            <span style={{
              fontSize: "12px",
              color: timeLeft <= 10 ? "#e74c3c" : "rgba(0,0,0,0.4)",
              transition: "color 0.3s",
            }}>
              {resendActive ? "Code expired" : "Code expires in"}
            </span>
          </div>

          <span
            className={resendActive ? "otp-resend-active" : "otp-resend-disabled"}
            onClick={handleResend}
            style={{ fontSize: "13px" }}
          >
            Resend OTP
          </span>
        </div>

        {/* Verify button */}
        <button onClick={handleVerify} className="otp-verify-btn">
          Verify OTP
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" }}>
          <span style={{ flex: 1, height: "0.5px", background: "rgba(0,0,0,0.1)" }} />
          <span style={{
            fontSize: "11px", color: "rgba(0,0,0,0.3)",
            textTransform: "uppercase", letterSpacing: "0.06em",
          }}>secure login</span>
          <span style={{ flex: 1, height: "0.5px", background: "rgba(0,0,0,0.1)" }} />
        </div>

        {/* Info note */}
        <div style={{
          display: "flex", alignItems: "flex-start", gap: "10px",
          background: "#f8f8f6", border: "0.5px solid rgba(0,0,0,0.07)",
          borderRadius: "10px", padding: "12px 14px",
        }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
            style={{ marginTop: "1px", flexShrink: 0, opacity: 0.4 }}>
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: "12px", color: "rgba(0,0,0,0.45)", lineHeight: 1.6 }}>
            Didn't receive a code? Check your spam folder or request a new one after the timer ends.
          </span>
        </div>

      </div>
    </div>
  );
}