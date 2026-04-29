import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaVials,      // Sample
  FaFlask,      // Experiment
  FaChartBar,   // Analytical
  FaClock       // Stability
} from "react-icons/fa";
import "./Userlist.css";

export default function Projectlist() {
  const navigate = useNavigate();
  const location = useLocation();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("project")) || [];

    //  Only Project ID + Name
    const formatted = stored.map(item => ({
      projectId: item.projectId,
      projectName: item.projectName
    }));

    setUsers(formatted);
  }, [location]);

  // ✅ Save selected project
  const handleNavigate = (path, project) => {
    localStorage.setItem("selectedProject", JSON.stringify(project));
    navigate(path);
  };

  return (
    <div className="user-container">

      <h2 className="user-title">📁 Project Users</h2>

      <div className="table-wrapper">
        <table className="user-table">

          <thead>
            <tr>
              <th>Project ID</th>
              <th>Project Name</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="3" className="no-data">
                  No Projects Available
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={index} className="table-row">

                  <td>
                    <strong>{user.projectId}</strong>
                  </td>

                  <td>
                    {user.projectName}
                  </td>

                  <td className="action-icons">

                    {/* SAMPLE */}
                    <FaVials
                      title="Sample"
                      className="icon blue"
                      onClick={() => handleNavigate("/sample", user)}
                    />

                    {/* EXPERIMENT */}
                    <FaFlask
                      title="Experiment"
                      className="icon green"
                      onClick={() => handleNavigate("/experiment", user)}
                    />

                    {/* ANALYTICAL */}
                    <FaChartBar
                      title="Analytical"
                      className="icon yellow"
                      onClick={() => handleNavigate("/analytical", user)}
                    />

                    {/* STABILITY */}
                    <FaClock
                      title="Stability"
                      className="icon purple"
                      onClick={() => handleNavigate("/study", user)}
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