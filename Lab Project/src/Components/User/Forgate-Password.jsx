import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "../Style/userotp.css";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  // 🔥 YE FUNCTION ADD KARNA THA
  async function handleSendLink(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/forgot-password",
        { email }
      );

      alert(res.data.message); //  "Reset link sent"

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <div className="main-container">
      <div className="login-card">

        {/* Left */}
        <div className="left-panel">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
            alt="illustration"
          />
        </div>

        {/* Right */}
        <div className="right-panel">
          <h2 className="title">Aryan Group</h2>
          <p className="subtitle">Forgot Password</p>

          {/* ✅ FORM */}
          <form onSubmit={handleSendLink}>
            <div className="input-group">
              <label>
                <i className="fa-solid fa-envelope"></i> Registered Email
              </label>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="btn-group">
              <button type="submit" className="login-btn">
                Send Reset Link
              </button>
            </div>

            <div className="create">
              <p
                className="forgot"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/")}
              >
                Back to Login
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}