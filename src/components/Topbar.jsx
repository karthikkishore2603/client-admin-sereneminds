import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Topbar.css";
import {
  FiSearch,
  FiFilter,
  FiBell,
  FiUser,
  FiLogOut,
  FiChevronDown,
} from "react-icons/fi";

const Topbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="topbar">
      <div className="topbar-search">
        <FiSearch className="search-icon" />
        <input className="search-input" type="text" placeholder="Search" />
        <button className="filter-btn">
          <FiFilter />
        </button>
      </div>
      <div className="topbar-right">
        <span className="lang">English</span>
        <span className="notif">
          <FiBell />
        </span>
        <div className="user-info" onClick={toggleDropdown}>
          <span className="user-name">{user?.name || "User"}</span>
          <span className="user-role">{user?.role || "User"}</span>
          <span className="user-avatar">
            <FiUser />
          </span>
          <FiChevronDown
            className={`dropdown-arrow ${showDropdown ? "rotated" : ""}`}
          />

          {showDropdown && (
            <div className="user-dropdown">
              <div className="dropdown-item" onClick={handleLogout}>
                <FiLogOut />
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
