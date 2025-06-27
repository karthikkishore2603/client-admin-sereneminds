import React from "react";
import "./Topbar.css";
import { FiSearch, FiFilter, FiBell, FiUser } from "react-icons/fi";

const Topbar = () => {
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
        <span className="user-info">
          <span className="user-name">Alex</span>
          <span className="user-role">Admin</span>
          <span className="user-avatar">
            <FiUser />
          </span>
        </span>
      </div>
    </div>
  );
};

export default Topbar;
