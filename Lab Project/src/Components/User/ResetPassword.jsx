import { useNavigate, useParams ,useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "../Style/userotp.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  // const { token } = useParams();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

const query = new URLSearchParams(useLocation().search);
const token = query.get("session");
  //  RESET FUNCTION
  async function handleReset(e) {
  e.preventDefault();

  if (newPassword !== confirmPassword) {
    setError("Passwords do not match ");
    return;
  }

  try {
    let res = await axios.post(
      "http://localhost:5000/api/reset-password",
      {
        token: token,
        newPassword: newPassword,
      }
    );

    alert(res.data.message);

    navigate("/"); // 🔥 login page

  } catch (err) {
    alert(err.response?.data?.message);
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
          <p className="subtitle">Reset Password</p>

          {/* FORM */}
          <form onSubmit={handleReset}>
            <div className="input-group">
              <label>
                <i className="fa-solid fa-lock"></i> New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>
                <i className="fa-solid fa-lock"></i> Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* ERROR */}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="btn-group">
              <button type="submit" className="login-btn">
                Reset Password
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