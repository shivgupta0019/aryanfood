import React, { useState, } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Style/userotp.css";
import axios from "axios";

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }



async function handleSubmit(e) {
  e.preventDefault();

  try {
   let res = await axios.post(
  "http://localhost:5000/api/login",
  {
    email: form.email,
    password: form.password,
  },
  {
    withCredentials: true // 🔥 VERY IMPORTANT
  }
);

    // 🔥 CASE 1: OTP REQUIRED
    if (res.data.otpRequired) {
      localStorage.setItem("email", form.email);
      navigate("/otp");
    }

    // 🔥 CASE 2: DIRECT LOGIN (NO OTP)
    else {
      localStorage.setItem("token", res.data.accessToken);
      navigate("/centrallab"); // ya dashboard route
    }

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
          <p className="subtitle">Login</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label><i className="fa-solid fa-user" style={{ color: "black" }}></i>Your Email</label>
              <input
                type="text"
                name="email"
                placeholder="Enter your Email"
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label><i className="fa-solid fa-lock" style={{ color: "black" }}></i>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                onChange={handleChange}
              />
            </div>
            <p className="forgot ms-4">
              <Link to="/forgot-password">Forgot your Password?</Link>
            </p>


            <div className="btn-group">
              <button type="submit" className="login-btn">
                Login
              </button>

            </div>
            <div className="create">
              <p className="forgot d-flex fs-6 mt-4 ms-5"><Link to="/signup" >Create Your Account?</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}