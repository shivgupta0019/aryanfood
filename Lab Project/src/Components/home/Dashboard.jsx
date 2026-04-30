import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle, FaEdit, FaBars, FaTimes } from "react-icons/fa";
import {
  FaFlask,
  FaVial,
  FaChartLine,
  FaUserShield,
  FaClipboardList,
  FaFileAlt,
  FaListAlt,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";

export default function Dashboard() {
  const navigate = useNavigate();

  // ✅ FIRST define states (IMPORTANT)
  const [role, setRole] = useState("");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    photo: null,
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(true);

  const lastScrollY = useRef(0);
  const dropdownRef = useRef(null);
  const NAVBAR_H = 58;

  // ✅ SCROLL
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (y < 10) setNavVisible(true);
      else if (y > lastScrollY.current) {
        setNavVisible(false);
        setMenuOpen(false);
      } else setNavVisible(true);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ BODY PADDING
  useEffect(() => {
    document.body.style.paddingTop = `${NAVBAR_H}px`;
    return () => {
      document.body.style.paddingTop = "";
    };
  }, []);

  // ✅ CLOSE DROPDOWN
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ✅ TOKEN + ROLE
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setRole(decoded.role);
    } catch {
      localStorage.clear();
      navigate("/");
    }
  }, []);

  // ✅ FETCH USER DATA FROM /api/user WITH AUTHORIZATION HEADER
  useEffect(() => {
    async function loadProfile() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/");
          return;
        }

        // ✅ API interceptor will automatically add Authorization header
        const res = await api.get("/users");

        setProfile({
          name: res.data.name || res.data.full_name || "User",
          email: res.data.email || "",
          phone: res.data.phone || res.data.contact || "",
          photo: res.data.photo || res.data.avatar || null,
        });
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        // If 401 or token invalid, interceptor will handle redirect
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        }
      }
    }

    loadProfile();
  }, [navigate]);

  // ✅ LINKS
  const allLinks = [
    ...(role === "admin"
      ? [
          { to: "/admin", icon: FaUserShield, label: "Admin" },
          { to: "/users", icon: FaUserShield, label: "Users" },
          { to: "/trf", icon: FaClipboardList, label: "TRF" },
          { to: "/allreports", icon: FaFileAlt, label: "All Report" },
        ]
      : []),
    { to: "/centrallab", icon: FaFlask, label: "Labs Report" },
    { to: "/project", icon: FaVial, label: "R&D" },
    { to: "/result", icon: FaChartLine, label: "Result" },
    { to: "/alltrf", icon: FaListAlt, label: "All Test Requests" },
  ];

  async function handleLogout() {
    try {
      await api.post("/logout"); //  backend call
    } catch (err) {}

    localStorage.clear();
    window.location.href = "/";
  }
  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          height: `${NAVBAR_H}px`,
          padding: "0 16px",
          background: "#fff",
          borderBottom: "1px solid rgba(0,0,0,0.09)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "transform 0.35s ease",
          transform: navVisible ? "translateY(0)" : "translateY(-110%)",
        }}
      >
        {/* LOGO */}
        <a
          href="#"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <img
            src="assets/photos/aryan.jpeg"
            alt="logo"
            style={{
              width: "38px",
              height: "38px",
              objectFit: "cover",
              borderRadius: "50%",
              border: "2.5px solid #111",
            }}
          />
          <span
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#111",
              whiteSpace: "nowrap",
            }}
          >
            Aryan Group
          </span>
        </a>

        {/* DESKTOP NAV LINKS */}
        <ul
          className="nav-desktop-links"
          style={{
            display: "flex",
            alignItems: "center",
            listStyle: "none",
            margin: "0 0 0 20px",
            padding: 0,
            gap: "2px",
            flex: 1,
            flexWrap: "nowrap",
          }}
        >
          {allLinks.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              {/* ✅ underline class handles hover via CSS below */}
              <Link to={to} className="nav-item-link">
                <Icon className="nav-item-icon" />
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* RIGHT SIDE */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexShrink: 0,
          }}
        >
          {/* PROFILE (desktop) */}
          <div
            ref={dropdownRef}
            style={{ position: "relative" }}
            className="profile-desktop"
          >
            <div
              onClick={() => setDropdownOpen((p) => !p)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f1f5f9")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                borderRadius: "10px",
                padding: "4px 10px 4px 5px",
                transition: "background 0.15s",
                userSelect: "none",
              }}
            >
              <FaUserCircle style={{ fontSize: "30px", color: "#555" }} />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  lineHeight: 1.25,
                }}
              >
                <span
                  style={{ fontSize: "13px", fontWeight: 600, color: "#111" }}
                >
                  {profile.name}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    color: "#888",
                    textTransform: "capitalize",
                  }}
                >
                  {role}
                </span>
              </div>
            </div>

            {dropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "52px",
                  width: "240px",
                  background: "#fff",
                  borderRadius: "12px",
                  padding: "14px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                  border: "1px solid #e5e7eb",
                  zIndex: 99999,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  {profile.photo ? (
                    <img
                      src={
                        profile.photo
                          ? `http://80.225.246.52:5137${profile.photo}`
                          : ""
                      }
                      alt="avatar"
                      style={{
                        width: "52px",
                        height: "52px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #185fa5",
                        marginBottom: "6px",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "52px",
                        height: "52px",
                        borderRadius: "50%",
                        background: "#e6f1fb",
                        border: "2px solid #185fa5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "#185fa5",
                        marginBottom: "6px",
                      }}
                    ></div>
                  )}
                  <p style={{ fontWeight: 600, fontSize: "13px", margin: 0 }}>
                    {profile.name}
                  </p>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#888",
                      margin: 0,
                      textTransform: "capitalize",
                    }}
                  ></p>
                </div>
                <hr
                  style={{
                    margin: "8px 0",
                    border: "none",
                    borderTop: "1px solid #e5e7eb",
                  }}
                />
                {[
                  ["Name", profile.name],
                  ["Email", profile.email],
                  ["Contact", profile.phone],
                ].map(([k, v]) => (
                  <p
                    key={k}
                    style={{
                      fontSize: "12px",
                      margin: "4px 0",
                      color: "#334155",
                    }}
                  >
                    <strong>{k}:</strong> {v}
                  </p>
                ))}
                <hr
                  style={{
                    margin: "8px 0",
                    border: "none",
                    borderTop: "1px solid #e5e7eb",
                  }}
                />
                <button
                  onClick={() => {
                    navigate("/profile");
                    setDropdownOpen(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "7px",
                    background: "#185fa5",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "13px",
                    cursor: "pointer",
                    marginBottom: "7px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <FaEdit style={{ fontSize: "12px" }} /> Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    border: "none",
                    background: "linear-gradient(45deg,#ff4b2b,#ff416c)",
                    color: "#fff",
                    padding: "7px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* HAMBURGER */}
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen((p) => !p)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "8px",
              fontSize: "20px",
              color: "#111",
            }}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div
        className="mobile-menu"
        style={{
          position: "fixed",
          top: `${NAVBAR_H}px`,
          left: 0,
          right: 0,
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          zIndex: 9998,
          transition: "transform 0.3s ease, opacity 0.3s ease",
          transform: menuOpen ? "translateY(0)" : "translateY(-10px)",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "all" : "none",
          padding: menuOpen ? "10px 0 14px" : "0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 18px 12px",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          {profile.photo ? (
            <img
              src={profile.photo}
              alt="avatar"
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                background: "#e6f1fb",
                border: "2px solid #185fa5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: 600,
                color: "#185fa5",
              }}
            ></div>
          )}
          <div>
            <p
              style={{
                margin: 0,
                fontWeight: 600,
                fontSize: "14px",
                color: "#111",
              }}
            >
              {profile.name}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "11px",
                color: "#888",
                textTransform: "capitalize",
              }}
            ></p>
          </div>
        </div>
        {allLinks.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            onClick={() => setMenuOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "11px 20px",
              fontSize: "14px",
              fontWeight: 500,
              color: "#111",
              textDecoration: "none",
              borderBottom: "1px solid #f8fafc",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <Icon style={{ fontSize: "15px", color: "#6b7280" }} />
            {label}
          </Link>
        ))}
        <div style={{ padding: "12px 16px 4px", display: "flex", gap: "8px" }}>
          <button
            onClick={() => {
              navigate("/profile");
              setMenuOpen(false);
            }}
            style={{
              flex: 1,
              padding: "8px",
              background: "#185fa5",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "13px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <FaEdit style={{ fontSize: "12px" }} /> Edit Profile
          </button>
          <button
            onClick={handleLogout}
            style={{
              flex: 1,
              padding: "8px",
              background: "linear-gradient(45deg,#ff4b2b,#ff416c)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "13px",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* ── CSS ── */}
      <style>{`
        /* ✅ Nav link — default black, no underline */
        .nav-item-link {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 13px;
          font-weight: 500;
          color: #111 !important;
          text-decoration: none;
          padding: 5px 10px;
          border-radius: 6px;
          white-space: nowrap;
          transition: background 0.15s;
          position: relative;
        }

        /* ✅ Underline effect on hover only */
        .nav-item-link::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 10px;
          right: 10px;
          height: 2px;
          background: #111;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.2s ease;
          border-radius: 2px;
        }

        .nav-item-link:hover {
          background: #f1f5f9;
          color: #111 !important;
        }

        .nav-item-link:hover::after {
          transform: scaleX(1);
        }

        .nav-item-icon {
          font-size: 13px;
          opacity: 0.65;
        }

        @media (max-width: 768px) {
          .nav-desktop-links { display: none !important; }
          .profile-desktop   { display: none !important; }
          .hamburger-btn     { display: flex !important; align-items: center; justify-content: center; }
        }
        @media (min-width: 769px) {
          .mobile-menu       { display: none !important; }
          .nav-desktop-links { display: flex !important; }
          .profile-desktop   { display: block !important; }
          .hamburger-btn     { display: none !important; }
        }
      `}</style>
    </>
  );
}
