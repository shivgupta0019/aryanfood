import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      let res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.log(err.response?.data);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    } finally {
      setLoading(false);
    }
  }

  async function toggleRole(user) {
    try {
      const newRole = user.role === "admin" ? "user" : "admin";
      await api.put(`/users/${user.id}/role`, { role: newRole });
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)),
      );
    } catch (err) {
      alert("Error updating role");
    }
  }

  return (
    <>
      <style>{`
        /* ===== BASE ===== */
        .users-container {
          padding: 30px;
          background: #f4f6f8;
          min-height: 100vh;
        }
        .users-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .count-badge {
          background: #4CAF50;
          color: #fff;
          padding: 6px 15px;
          border-radius: 20px;
          font-size: 14px;
          white-space: nowrap;
        }
        .table-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .header-row {
          display: grid;
          grid-template-columns: 1.5fr 2fr 1.5fr 1fr 1.5fr;
          padding: 12px;
          background: white;
          color: black;
          border-radius: 8px;
        }
        .header-cell { font-weight: 600; }
        .data-row {
          display: grid;
          grid-template-columns: 1.5fr 2fr 1.5fr 1fr 1.5fr;
          padding: 15px;
          background: #fff;
          border-radius: 10px;
          align-items: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .data-cell {
          font-size: 14px;
          word-break: break-word;
        }
        .name-box {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .avatar {
          width: 35px;
          height: 35px;
          min-width: 35px;
          border-radius: 50%;
          border: 1px solid black;
          background: white;
          color: black;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        .role-badge {
          padding: 5px 12px;
          border-radius: 20px;
          color: #fff;
          font-size: 12px;
          display: inline-block;
        }
        .role-btn {
          padding: 6px 14px;
          border-radius: 6px;
          cursor: pointer;
          background: transparent;
          font-weight: 500;
          transition: 0.3s;
          white-space: nowrap;
        }

        /* ===== SKELETON LOADER ===== */
        @keyframes shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }

        .skeleton {
          background: linear-gradient(90deg, #e8eaed 25%, #f5f6f7 50%, #e8eaed 75%);
          background-size: 600px 100%;
          animation: shimmer 1.4s infinite linear;
          border-radius: 6px;
        }

        .skeleton-header-bar {
          height: 20px;
          width: 180px;
          border-radius: 6px;
        }

        .skeleton-badge {
          height: 32px;
          width: 120px;
          border-radius: 20px;
        }

        .skeleton-table-header {
          padding: 12px;
          background: white;
          border-radius: 8px;
          display: grid;
          grid-template-columns: 1.5fr 2fr 1.5fr 1fr 1.5fr;
          gap: 12px;
        }

        .skeleton-th {
          height: 16px;
          border-radius: 4px;
        }

        .skeleton-row {
          display: grid;
          grid-template-columns: 1.5fr 2fr 1.5fr 1fr 1.5fr;
          gap: 12px;
          padding: 15px;
          background: #fff;
          border-radius: 10px;
          align-items: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .skeleton-name-box {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .skeleton-avatar {
          width: 35px;
          height: 35px;
          min-width: 35px;
          border-radius: 50%;
        }

        .skeleton-text {
          height: 14px;
          border-radius: 4px;
          flex: 1;
        }

        .skeleton-text-sm {
          height: 14px;
          width: 70%;
          border-radius: 4px;
        }

        .skeleton-badge-pill {
          height: 26px;
          width: 60px;
          border-radius: 20px;
        }

        .skeleton-btn {
          height: 32px;
          width: 110px;
          border-radius: 6px;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
          .users-container { padding: 16px; }
          .header-row { display: none; }
          .data-row {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
            padding: 14px;
          }
          .data-cell { width: 100%; }
          .data-cell::before {
            content: attr(data-label);
            display: block;
            font-size: 11px;
            font-weight: 600;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            margin-bottom: 3px;
          }
          .data-cell.name-cell::before { display: none; }

          .skeleton-table-header { display: none; }
          .skeleton-row {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .skeleton-name-box { width: 100%; }
          .skeleton-text-sm { width: 100%; }
          .skeleton-badge-pill { width: 70px; }
          .skeleton-btn { width: 120px; }
        }

        @media (max-width: 480px) {
          .users-container { padding: 12px; }
          .users-header h2 { font-size: 16px; }
        }
      `}</style>

      <div className="users-container">
        {/* ===== HEADER ===== */}
        <div className="users-header">
          {loading ? (
            <>
              <div className="skeleton skeleton-header-bar" />
              <div className="skeleton skeleton-badge" />
            </>
          ) : (
            <>
              <h2 style={{ margin: 0 }}>👥 Users Management</h2>
              <span className="count-badge">Total Users: {users.length}</span>
            </>
          )}
        </div>

        {/* ===== SKELETON STATE ===== */}
        {loading ? (
          <div className="table-container">
            {/* skeleton header */}
            <div className="skeleton-table-header">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton skeleton-th" />
              ))}
            </div>

            {/* skeleton rows */}
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-row">
                {/* name */}
                <div className="skeleton-name-box">
                  <div className="skeleton skeleton-avatar" />
                  <div className="skeleton skeleton-text" />
                </div>
                {/* email */}
                <div className="skeleton skeleton-text-sm" />
                {/* phone */}
                <div
                  className="skeleton skeleton-text-sm"
                  style={{ width: "55%" }}
                />
                {/* role badge */}
                <div className="skeleton skeleton-badge-pill" />
                {/* action btn */}
                <div className="skeleton skeleton-btn" />
              </div>
            ))}
          </div>
        ) : (
          /* ===== DATA STATE ===== */
          <div className="table-container">
            <div className="header-row">
              <span className="header-cell">Name</span>
              <span className="header-cell">Email</span>
              <span className="header-cell">Phone</span>
              <span className="header-cell">Role</span>
              <span className="header-cell">Action</span>
            </div>

            {users.map((user, index) => (
              <div key={index} className="data-row">
                <div className="data-cell name-cell">
                  <div className="name-box">
                    <div className="avatar">
                      {(user.name || user.NAME || "U").charAt(0).toUpperCase()}
                    </div>
                    <span>{user.name || user.NAME || "Unknown"}</span>
                  </div>
                </div>

                <div className="data-cell" data-label="Email">
                  {user.email || user.EMAIL}
                </div>
                <div className="data-cell" data-label="Phone">
                  {user.phone || user.PHONE}
                </div>

                <div className="data-cell" data-label="Role">
                  <span
                    className="role-badge"
                    style={{
                      backgroundColor:
                        user.role === "admin" ? "#ff4d4f" : "#4CAF50",
                    }}
                  >
                    {user.role === "admin" ? "Admin" : "User"}
                  </span>
                </div>

                <div className="data-cell" data-label="Action">
                  <button
                    onClick={() => toggleRole(user)}
                    className="role-btn"
                    style={{
                      border:
                        user.role === "admin"
                          ? "1px solid #eb161a"
                          : "1px solid #4CAF50",
                      color: user.role === "admin" ? "#eb161a" : "#4CAF50",
                    }}
                  >
                    {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
