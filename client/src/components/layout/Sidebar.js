import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">AH</div>
        <div className="sidebar-title">Health Assistant</div>
      </div>
      <ul className="sidebar-menu">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `sidebar-menu-item ${isActive ? "active" : ""}`
            }
            end
          >
            <span className="sidebar-icon">🏠</span>
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/image-analysis"
            className={({ isActive }) =>
              `sidebar-menu-item ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-icon">🔍</span>
            <span>Image Analysis</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/speech"
            className={({ isActive }) =>
              `sidebar-menu-item ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-icon">🎙️</span>
            <span>Speech Transcription</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/notes"
            className={({ isActive }) =>
              `sidebar-menu-item ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-icon">📝</span>
            <span>Clinical Notes</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
