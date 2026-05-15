import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEdit,
  FaCamera,
  FaArrowLeft,
  FaCheck,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaVenusMars,
  FaCity,
  FaFlag,
  FaAddressCard,
  FaInfoCircle,
} from "react-icons/fa";
import api from "../../api/axiosConfig";
import { baseURL } from "../../api/axiosConfig";

// Custom hook for responsive breakpoints
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
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

export default function ProfilePage() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 768px)");

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
  const [updateLoading, setUpdateLoading] = useState(false);

  async function loadProfile() {
    try {
      setLoading(true);
      const res = await api.get("/profile");
      setProfileData({
        name: res.data.full_name || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        dob: res.data.dob ? new Date(res.data.dob).toISOString().split("T")[0] : "",
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
    setPreview(URL.createObjectURL(file));
    setProfileData({ ...profileData, photo: file });
  }

  async function handleUpdate() {
    try {
      setUpdateLoading(true);
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
      setImageVersion(Date.now());
      await loadProfile();
      setEditMode(false);
    } catch (err) {
      console.log(err);
      alert("Failed to update profile");
    } finally {
      setUpdateLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading profile...</p>
      </div>
    );
  }

  // Responsive overrides
  const responsiveStyles = {
    container: {
      ...styles.container,
      marginTop: isMobile ? "70px" : "80px",
      padding: isMobile ? "0 1rem" : "0 1.5rem",
    },
    card: {
      ...styles.card,
      borderRadius: isMobile ? "30px" : "50px",
    },
    header: {
      ...styles.header,
      padding: isMobile ? "1.2rem 1.2rem 0 1.2rem" : "2rem 2rem 0 2rem",
    },
    headerTitle: {
      ...styles.headerTitle,
      fontSize: isMobile ? "24px" : "28px",
    },
    content: {
      ...styles.content,
      padding: isMobile ? "1.2rem" : "2rem",
    },
    avatar: {
      ...styles.avatar,
      width: isMobile ? "80px" : "100px",
      height: isMobile ? "80px" : "100px",
    },
    avatarPlaceholder: {
      ...styles.avatarPlaceholder,
      width: isMobile ? "80px" : "100px",
      height: isMobile ? "80px" : "100px",
    },
    initials: {
      ...styles.initials,
      fontSize: isMobile ? "28px" : "36px",
    },
    changePhotoBtn: {
      ...styles.changePhotoBtn,
      padding: isMobile ? "4px 8px" : "6px 12px",
      fontSize: isMobile ? "10px" : "12px",
      right: isMobile ? "-5px" : "-10px",
    },
    userName: {
      ...styles.userName,
      fontSize: isMobile ? "18px" : "20px",
    },
    detailsGrid: {
      ...styles.detailsGrid,
      gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
      gap: isMobile ? "0.75rem" : "1rem",
    },
    detailCard: {
      ...styles.detailCard,
      padding: isMobile ? "0.75rem" : "1rem",
    },
    formGrid: {
      ...styles.formGrid,
      gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
      gap: isMobile ? "0.75rem" : "1rem",
    },
    formActions: {
      ...styles.formActions,
      flexDirection: isMobile ? "column" : "row",
    },
    cancelBtn: {
      ...styles.cancelBtn,
      width: isMobile ? "100%" : "auto",
    },
    saveBtn: {
      ...styles.saveBtn,
      width: isMobile ? "100%" : "auto",
    },
    editProfileBtn: {
      ...styles.editProfileBtn,
      width: isMobile ? "100%" : "auto",
      justifyContent: "center",
    },
    backBtn: {
      ...styles.backBtn,
      width: "100%",
    },
  };

  return (
    <div style={responsiveStyles.container}>
      <div style={responsiveStyles.card}>
        {/* Header Section */}
        <div style={responsiveStyles.header}>
          <h1 style={responsiveStyles.headerTitle}>Profile</h1>
          <p style={styles.headerSubtitle}>Manage your personal information</p>
        </div>

        <div style={responsiveStyles.content}>
          {/* Profile Section */}
          <div style={styles.profileSection}>
            <div style={styles.avatarWrapper}>
              {profileData.photo || preview ? (
                <img
                  src={
                    preview
                      ? preview
                      : `${baseURL}${profileData.photo}?v=${imageVersion}`
                  }
                  alt="profile"
                  style={responsiveStyles.avatar}
                />
              ) : (
                <div style={responsiveStyles.avatarPlaceholder}>
                  <span style={responsiveStyles.initials}>{initials}</span>
                </div>
              )}

              {editMode && (
                <button
                  onClick={() => fileRef.current.click()}
                  style={responsiveStyles.changePhotoBtn}
                >
                  <FaCamera size={14} />
                  <span style={{ marginLeft: "6px" }}>Change</span>
                </button>
              )}

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handlePhotoChange}
              />
            </div>

            <div style={styles.userInfo}>
              <h2 style={responsiveStyles.userName}>
                {profileData.name || "Your Name"}
              </h2>
              <p style={styles.userEmail}>{profileData.email}</p>
            </div>

            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                style={responsiveStyles.editProfileBtn}
              >
                <FaEdit size={14} />
                Edit Profile
              </button>
            )}
          </div>

          {/* Details Section */}
          {!editMode ? (
            <div style={responsiveStyles.detailsGrid}>
              <DetailCard
                icon={<FaUser />}
                label="Full Name"
                value={profileData.name}
                isMobile={isMobile}
              />
              <DetailCard
                icon={<FaEnvelope />}
                label="Email"
                value={profileData.email}
                isMobile={isMobile}
              />
              <DetailCard
                icon={<FaPhone />}
                label="Contact"
                value={profileData.phone}
                isMobile={isMobile}
              />
              <DetailCard
                icon={<FaCalendar />}
                label="Date of Birth"
                value={profileData.dob}
                isMobile={isMobile}
              />
              <DetailCard
                icon={<FaVenusMars />}
                label="Gender"
                value={profileData.gender}
                isMobile={isMobile}
              />
              <DetailCard
                icon={<FaCity />}
                label="City"
                value={profileData.city}
                isMobile={isMobile}
              />
              <DetailCard
                icon={<FaFlag />}
                label="State"
                value={profileData.state}
                isMobile={isMobile}
              />
              <DetailCard
                icon={<FaAddressCard />}
                label="Address"
                value={profileData.address}
                fullWidth
                isMobile={isMobile}
              />
              <DetailCard
                icon={<FaInfoCircle />}
                label="Bio"
                value={profileData.bio}
                fullWidth
                isMobile={isMobile}
              />
            </div>
          ) : (
            <div style={styles.editForm}>
              <div style={responsiveStyles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    readOnly
                    disabled
                    style={{ ...styles.input, ...styles.inputReadonly }}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Phone Number</label>
                  <input
                    type="text"
                    value={profileData.phone}
                    readOnly
                    disabled
                    style={{ ...styles.input, ...styles.inputReadonly }}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={profileData.dob}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Gender</label>
                  <select
                    name="gender"
                    value={profileData.gender}
                    onChange={handleChange}
                    style={styles.input}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>City</label>
                  <input
                    type="text"
                    name="city"
                    value={profileData.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>State</label>
                  <input
                    type="text"
                    name="state"
                    value={profileData.state}
                    onChange={handleChange}
                    placeholder="Enter your state"
                    style={styles.input}
                  />
                </div>

                <div style={{ ...styles.formGroup, gridColumn: "span 2" }}>
                  <label style={styles.label}>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={profileData.address}
                    onChange={handleChange}
                    placeholder="Enter your full address"
                    style={styles.input}
                  />
                </div>

                <div style={{ ...styles.formGroup, gridColumn: "span 2" }}>
                  <label style={styles.label}>Bio</label>
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Write something about yourself..."
                    style={{ ...styles.input, ...styles.textarea }}
                  />
                </div>
              </div>

              <div style={responsiveStyles.formActions}>
                <button onClick={() => setEditMode(false)} style={responsiveStyles.cancelBtn}>
                  <FaTimes size={14} />
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={updateLoading}
                  style={responsiveStyles.saveBtn}
                >
                  {updateLoading ? (
                    "Saving..."
                  ) : (
                    <>
                      <FaCheck size={14} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Back Button */}
          {!editMode && (
            <button onClick={() => navigate(-1)} style={responsiveStyles.backBtn}>
              <FaArrowLeft size={14} />
              Go Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Detail Card Component (updated to accept isMobile)
function DetailCard({ icon, label, value, fullWidth, isMobile }) {
  const cardStyle = {
    ...styles.detailCard,
    padding: isMobile ? "0.75rem" : "1rem",
    ...(fullWidth && { gridColumn: "span 2" }),
  };
  // On mobile, force fullWidth cards to span single column
  if (isMobile && fullWidth) {
    cardStyle.gridColumn = "span 1";
  }
  return (
    <div style={cardStyle}>
      <div style={styles.detailIcon}>{icon}</div>
      <div style={styles.detailContent}>
        <p style={styles.detailLabel}>{label}</p>
        <p style={styles.detailValue}>{value || "—"}</p>
      </div>
    </div>
  );
}

// Base styles (no media queries needed, responsive handled by useMediaQuery)
const styles = {
  container: {
    maxWidth: "900px",
    margin: "1rem auto",
    padding: "0 1.5rem",
    marginTop: "80px",
  },
  card: {
    background: "#FFFFFF",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
    border: "1px solid #E0E0E0",
    borderRadius: "50px",
    overflow: "hidden",
  },
  header: {
    padding: "2rem 2rem 0 2rem",
    borderBottom: "1px solid #E0E0E0",
  },
  headerTitle: {
    fontSize: "28px",
    fontWeight: "300",
    margin: "0 0 0.5rem 0",
    color: "#000000",
    letterSpacing: "-0.5px",
  },
  headerSubtitle: {
    fontSize: "14px",
    color: "#666666",
    margin: "0 0 1.5rem 0",
  },
  content: {
    padding: "2rem",
  },
  profileSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "2.5rem",
    paddingBottom: "2rem",
    borderBottom: "1px solid #F0F0F0",
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: "1rem",
  },
  avatar: {
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #000000",
  },
  avatarPlaceholder: {
    borderRadius: "50%",
    background: "#F5F5F5",
    border: "2px solid #000000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontWeight: "400",
    color: "#000000",
  },
  changePhotoBtn: {
    position: "absolute",
    bottom: "0",
    right: "-10px",
    display: "flex",
    alignItems: "center",
    background: "#000000",
    color: "#FFFFFF",
    border: "none",
    cursor: "pointer",
    transition: "background 0.2s",
    borderRadius: "0",
  },
  userInfo: {
    textAlign: "center",
    marginTop: "1rem",
  },
  userName: {
    fontWeight: "500",
    margin: "0 0 0.25rem 0",
    color: "#000000",
  },
  userEmail: {
    fontSize: "13px",
    color: "#666666",
    margin: 0,
  },
  editProfileBtn: {
    marginTop: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 20px",
    background: "#000000",
    color: "#FFFFFF",
    border: "none",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background 0.2s",
    borderRadius: "0",
    letterSpacing: "0.5px",
  },
  detailsGrid: {
    display: "grid",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  detailCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: "1rem",
    background: "#FAFAFA",
    border: "1px solid #F0F0F0",
  },
  detailIcon: {
    color: "#000000",
    fontSize: "18px",
    marginTop: "2px",
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: "11px",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: "#999999",
    marginBottom: "6px",
  },
  detailValue: {
    fontSize: "14px",
    color: "#333333",
    margin: 0,
    lineHeight: "1.5",
  },
  editForm: {
    marginBottom: "1.5rem",
  },
  formGrid: {
    display: "grid",
    gap: "1rem",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "12px",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: "#666666",
    marginBottom: "8px",
  },
  input: {
    padding: "10px 12px",
    background: "#FFFFFF",
    border: "1px solid #CCCCCC",
    fontSize: "14px",
    fontFamily: "inherit",
    color: "#000000",
    outline: "none",
    transition: "border-color 0.2s",
    borderRadius: "0",
  },
  inputReadonly: {
    background: "#F5F5F5",
    color: "#999999",
    cursor: "not-allowed",
    borderColor: "#E0E0E0",
  },
  textarea: {
    resize: "vertical",
    fontFamily: "inherit",
  },
  formActions: {
    display: "flex",
    gap: "1rem",
    marginTop: "1.5rem",
  },
  cancelBtn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "10px",
    background: "#FFFFFF",
    color: "#000000",
    border: "1px solid #CCCCCC",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
    borderRadius: "0",
    letterSpacing: "0.5px",
  },
  saveBtn: {
    flex: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "10px",
    background: "#000000",
    color: "#FFFFFF",
    border: "none",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background 0.2s",
    borderRadius: "0",
    letterSpacing: "0.5px",
  },
  backBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "10px",
    background: "#FFFFFF",
    color: "#666666",
    border: "1px solid #E0E0E0",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
    borderRadius: "0",
    marginTop: "0.5rem",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
    marginTop: "100px",
  },
  spinner: {
    width: "32px",
    height: "32px",
    border: "2px solid #F0F0F0",
    borderTop: "2px solid #000000",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: {
    marginTop: "1rem",
    color: "#666666",
    fontSize: "14px",
  },
};

// Add keyframe animation to document head
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  button:hover {
    opacity: 0.85;
  }
  input:focus, select:focus, textarea:focus {
    border-color: #000000 !important;
  }
`;
document.head.appendChild(styleSheet);