import React, { useState } from "react";
import "./Sidebar.css";
import { Link, useLocation } from "react-router-dom";
import {
  MdKeyboardArrowDown,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { FiHome } from "react-icons/fi";
import { BsCircle } from "react-icons/bs";
import { RiBuildingLine } from "react-icons/ri";
import { IoRemoveCircleOutline } from "react-icons/io5";

const Sidebar = () => {
  const location = useLocation();
  const [openMaster, setOpenMaster] = useState(true);

  const isActive = (path) => location.pathname === path;

  const masterLinks = [
    "Country",
    "State",
    "City",
    "Institute",
    "Branch",
    "School",
    "Board",
    "Class",
    "Division",
    "Academic Year",
    "Student",
    "Emotion",
    "Zone",
    "Category",
    "Sub Category",
    "Impact",
    "Pleasantness",
    "Predefined List",
  ];

  return (
    <div className="sidebar enhanced-sidebar">
      <div className="sidebar-header">
        <img
          src="/logo1.png"
          alt="Serene Minds Logo"
          className="sidebar-logo"
        />
      </div>

      <ul className="sidebar-list">
        <li className={isActive("/") ? "active" : ""}>
          <FiHome className="icon" />
          <Link to="/">Dashboard</Link>
        </li>
        <li className={isActive("/reports") ? "active" : ""}>
          <BsCircle className="icon" />
          <Link to="/reports">Reports</Link>
        </li>
        <li className={isActive("/graph") ? "active" : ""}>
          <BsCircle className="icon" />
          <Link to="/graph">Graph</Link>
        </li>
      </ul>

      <div
        className={`master-toggle${openMaster ? " open" : ""}`}
        onClick={() => setOpenMaster(!openMaster)}
        tabIndex={0}
        role="button"
        aria-expanded={openMaster}
      >
        <RiBuildingLine className="icon" />
        <span>Master Data</span>
        <span className="badge">{masterLinks.length}</span>
        <span className="arrow">
          {openMaster ? (
            <MdKeyboardArrowDown />
          ) : (
            <MdOutlineKeyboardArrowRight />
          )}
        </span>
      </div>

      {openMaster && (
        <ul className="sub-menu">
          {masterLinks.map((item, i) => (
            <li
              key={i}
              className={
                isActive(`/master/${item.toLowerCase().replace(" ", "")}`)
                  ? "active"
                  : ""
              }
            >
              <IoRemoveCircleOutline className="icon sub-menu-icon" />
              <Link to={`/master/${item.toLowerCase().replace(" ", "")}`}>
                {item}
                {item === "Student" && <span className="new-badge">New</span>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
