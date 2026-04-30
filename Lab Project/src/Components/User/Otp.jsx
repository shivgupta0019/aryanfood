import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../Style/userotp.css";
import axios from "axios";
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
        .get({
          otp: { transport: ["sms"] },
          signal: ac.signal,
        })
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

    otpArray.forEach((val, i) => {
      newOtp[i] = val;
    });

    setOtp(newOtp);

    const lastIndex = otpArray.length - 1;
    if (lastIndex >= 0) {
      inputsRef.current[lastIndex].focus();
    }
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

  return (
    <div className="auth-container">
      <div className="auth-box fade-in">
        <h2>Enter OTP</h2>

        <div className="otp-box">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className={`otp-input ${digit ? "filled" : ""}`}
            />
          ))}
        </div>

        {/* ⏳ TIMER + RESEND (RIGHT SIDE) */}
        <div className="d-flex justify-content-between align-items-center mt-2">
          {!resendActive ? (
            <p className="timer m-0">Resend OTP in {timeLeft}s</p>
          ) : (
            <span></span>
          )}

          <span
            className={`resend-link ${!resendActive ? "disabled" : ""}`}
            onClick={handleResend}
          >
            Resend OTP
          </span>
        </div>

        <button onClick={handleVerify} className="verify-btn">
          Verify OTP
        </button>
      </div>
    </div>
  );
}
