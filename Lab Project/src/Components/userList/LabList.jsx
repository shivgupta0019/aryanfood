import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaVial,
  FaUser,
  FaBoxes,
  FaMicroscope
} from "react-icons/fa";
import "./Userlist.css";

export default function LabList() {
  const navigate = useNavigate();
  const location = useLocation();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("centrallab")) || [];

    const formatted = stored.map(item => ({
      name: item.labname,
      location: item.location
    }));

    setUsers(formatted);
  }, [location]);

  return (
    <div className="user-container">

      <h2 className="user-title">🏢 Lab Users</h2>

      <div className="table-wrapper">
        <table className="user-table">

          <thead>
            <tr>
              <th>Lab Name</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="3" className="no-data">
                  No Labs Available
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={index} className="table-row">

                  <td>
                    <strong>{user.name}</strong>
                  </td>

                  <td>
                    <span className="location-badge">
                      {user.location}
                    </span>
                  </td>

                  <td className="action-icons">

                    <FaVial
                      title="Test"
                      className="icon green"
                      onClick={() => navigate("/test")}
                    />

                    <FaUser
                      title="User"
                      className="icon yellow"
                      onClick={() => navigate("/user")}
                    />

                    <FaBoxes
                      title="Raw Material"
                      className="icon red"
                      onClick={() => navigate("/metairial")}
                    />

                    <FaMicroscope
                      title="Instrument"
                      className="icon purple"
                      onClick={() => navigate("/instrument")}
                    />

                  </td>

                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}