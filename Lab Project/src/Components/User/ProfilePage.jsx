import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import api from "../../api/axiosConfig";

export default function ProfilePage() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    bio: "",
    photo: null,
  });

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);
  const [imageVersion, setImageVersion] = useState(Date.now());

  async function loadProfile() {
    try {
      const token = localStorage.getItem("token");

      setLoading(true);

      const res = await api.get("/profile");

      console.log("API DATA:", res.data);

      setProfileData({
        name: res.data.full_name || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        dob: res.data.dob
          ? new Date(res.data.dob).toISOString().split("T")[0]
          : "",
        gender: res.data.gender || "",
        city: res.data.city || "",
        state: res.data.state || "",
        address: res.data.address || "",
        bio: res.data.bio || "",
        photo: res.data.photo || null,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  // ✅ PAGE LOAD
  useEffect(() => {
    loadProfile();
  }, []);

  const initials =
    profileData.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  function handleChange(e) {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  }

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file)); // preview ke liye
    setProfileData({ ...profileData, photo: file });
  }

  async function handleUpdate() {
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("full_name", profileData.name);
      formData.append("dob", profileData.dob);
      formData.append("gender", profileData.gender);
      formData.append("city", profileData.city);
      formData.append("state", profileData.state);
      formData.append("address", profileData.address);
      formData.append("bio", profileData.bio);

      if (fileRef.current.files[0]) {
        formData.append("photo", fileRef.current.files[0]);
      }

      const res = await api.put("/profile", formData);

      alert(res.data.message);
      setPreview(null);
      setImageVersion(Date.now()); // 🔥 ye add kar
      await loadProfile();
    } catch (err) {
      console.log(err);
    }
  }
  const inp = {
    width: "100%",
    padding: "9px 11px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    boxSizing: "border-box",
    color: "#333",
    background: "white",
    outline: "none",
  };

  const readOnlyInp = {
    ...inp,
    background: "#f5f5f5",
    color: "#999",
    cursor: "not-allowed",
  };

  const labelSt = {
    fontSize: "12px",
    color: "#888",
    display: "block",
    marginBottom: "4px",
  };
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "150px" }}>
        <h3>Loading profile...</h3>
      </div>
    );
  }
  return (
    <div
      style={{
        maxWidth: "680px",
        margin: "2rem auto",
        padding: "0 1rem",
        marginTop: "120px",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "14px",
          border: "0.5px solid #e0e0e0",
          overflow: "hidden",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ background: "#185fa5", height: "100px" }}></div>

        <div style={{ padding: "0 1.5rem 2rem" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "-50px",
              marginBottom: "1.5rem",
            }}
          >
            <div style={{ position: "relative" }}>
              {profileData.photo ? (
                <img
                  src={
                    preview
                      ? preview
                      : profileData.photo
                        ? `http://localhost:5000${profileData.photo}?t=${imageVersion}`
                        : ""
                  }
                  alt="profile"
                  style={{
                    width: "95px",
                    height: "95px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "3px solid white",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "95px",
                    height: "95px",
                    borderRadius: "50%",
                    background: "#e6f1fb",
                    border: "3px solid white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "30px",
                    fontWeight: "500",
                    color: "#185fa5",
                  }}
                >
                  {initials}
                </div>
              )}

              {editMode && (
                <div
                  onClick={() => fileRef.current.click()}
                  style={{
                    position: "absolute",
                    bottom: "2px",
                    right: "2px",
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "#185fa5",
                    border: "2px solid white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  📷
                </div>
              )}

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handlePhotoChange}
              />
            </div>

            <p
              style={{
                fontSize: "18px",
                fontWeight: "500",
                margin: "10px 0 2px",
                color: "#222",
              }}
            >
              {profileData.name || "Your Name"}
            </p>

            <p style={{ fontSize: "13px", color: "#888", margin: 0 }}>
              {profileData.email} • {loggedInUser.role || "User"}
            </p>

            {!editMode && (
              <div
                onClick={() => setEditMode(true)}
                style={{
                  marginTop: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: "pointer",
                  color: "#185fa5",
                  fontSize: "13px",
                  fontWeight: "500",
                  border: "1px solid #185fa5",
                  borderRadius: "20px",
                  padding: "5px 14px",
                }}
              >
                <FaEdit style={{ fontSize: "13px" }} />
                Edit Profile
              </div>
            )}
          </div>

          {/* ── DETAILS VIEW (editMode false) ── */}
          {!editMode ? (
            <div
              style={{
                background: "#f9f9f9",
                borderRadius: "10px",
                padding: "1.2rem",
                border: "0.5px solid #eee",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "14px",
                }}
              >
                <div>
                  <p style={labelSt}>Full Name</p>
                  <p style={valSt}>{profileData.name || "—"}</p>
                </div>

                <div>
                  <p style={labelSt}>Email</p>
                  <p style={valSt}>{profileData.email || "—"}</p>
                </div>

                <div>
                  <p style={labelSt}>Contact Number</p>
                  <p style={valSt}>{profileData.phone || "—"}</p>
                </div>

                <div>
                  <p style={labelSt}>Date of Birth</p>
                  <p style={valSt}>{profileData.dob || "—"}</p>
                </div>

                <div>
                  <p style={labelSt}>Gender</p>
                  <p style={valSt}>{profileData.gender || "—"}</p>
                </div>

                <div>
                  <p style={labelSt}>City</p>
                  <p style={valSt}>{profileData.city || "—"}</p>
                </div>

                <div>
                  <p style={labelSt}>State</p>
                  <p style={valSt}>{profileData.state || "—"}</p>
                </div>

                <div style={{ gridColumn: "span 2" }}>
                  <p style={labelSt}>Address</p>
                  <p style={valSt}>{profileData.address || "—"}</p>
                </div>

                <div style={{ gridColumn: "span 2" }}>
                  <p style={labelSt}>Bio</p>
                  <p style={valSt}>{profileData.bio || "—"}</p>
                </div>
              </div>
            </div>
          ) : (
            // ── EDIT FORM (editMode true) ──
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "14px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <label style={labelSt}>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    style={inp}
                  />
                </div>

                <div>
                  <label style={labelSt}>Email (read only)</label>
                  <input
                    type="email"
                    value={profileData.email}
                    readOnly
                    style={readOnlyInp}
                  />
                </div>

                <div>
                  <label style={labelSt}>Contact Number</label>
                  <input
                    type="text"
                    value={profileData.phone}
                    readOnly
                    style={readOnlyInp}
                  />
                </div>

                <div>
                  <label style={labelSt}>Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={profileData.dob}
                    onChange={handleChange}
                    style={inp}
                  />
                </div>

                <div>
                  <label style={labelSt}>Gender</label>
                  <select
                    name="gender"
                    value={profileData.gender}
                    onChange={handleChange}
                    style={inp}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label style={labelSt}>City</label>
                  <input
                    type="text"
                    name="city"
                    value={profileData.city}
                    onChange={handleChange}
                    placeholder="City"
                    style={inp}
                  />
                </div>

                <div>
                  <label style={labelSt}>State</label>
                  <input
                    type="text"
                    name="state"
                    value={profileData.state}
                    onChange={handleChange}
                    placeholder="State"
                    style={inp}
                  />
                </div>

                <div style={{ gridColumn: "span 2" }}>
                  <label style={labelSt}>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={profileData.address}
                    onChange={handleChange}
                    placeholder="Full Address"
                    style={inp}
                  />
                </div>

                <div style={{ gridColumn: "span 2" }}>
                  <label style={labelSt}>Bio</label>
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Write something about yourself..."
                    style={{
                      ...inp,
                      resize: "vertical",
                      paddingTop: "8px",
                      lineHeight: "1.5",
                    }}
                  />
                </div>
              </div>

              {/* BUTTONS */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => setEditMode(false)}
                  style={{
                    flex: 1,
                    padding: "11px",
                    background: "white",
                    color: "#185fa5",
                    border: "1px solid #185fa5",
                    borderRadius: "8px",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  ✕ Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  style={{
                    flex: 2,
                    padding: "11px",
                    background: "#185fa5",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "15px",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  Update Profile
                </button>
              </div>
            </>
          )}

          {/* BACK BUTTON */}
          {!editMode && (
            <button
              onClick={() => navigate(-1)}
              style={{
                marginTop: "16px",
                width: "100%",
                padding: "10px",
                background: "white",
                color: "#185fa5",
                border: "1px solid #185fa5",
                borderRadius: "8px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              ← Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const valSt = {
  fontSize: "14px",
  color: "#333",
  margin: 0,
  fontWeight: "400",
  wordBreak: "break-word",
};

// const labelSt = {
//   fontSize: "12px",
//   color: "#888",
//   display: "block",
//   marginBottom: "4px",
//   margin: "0 0 4px",
// };
