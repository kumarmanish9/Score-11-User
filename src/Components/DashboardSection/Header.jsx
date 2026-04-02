import React from "react";
import { FaBell, FaSearch } from "react-icons/fa";
import "./Header.css";

function Header() {
  return (
    <nav className="navbar navbar-expand-lg header px-4">

      {/* Left - Page Title */}
      <div className="d-flex align-items-center">
        <h4 className="mb-0 fw-bold text-white">Dashboard</h4>
      </div>

      {/* Center - Search */}
      <div className="mx-auto search-box d-none d-md-flex">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search players, matches..."
          className="form-control"
        />
      </div>

      {/* Right - Icons + Profile */}
      <div className="d-flex align-items-center gap-3">

        {/* Notification */}
        <div className="icon-box">
          <FaBell />
          <span className="notification-badge">3</span>
        </div>

        {/* Profile Dropdown */}
        <div className="dropdown">
          <div
            className="d-flex align-items-center profile"
            data-bs-toggle="dropdown"
            style={{ cursor: "pointer" }}
          >
            <img
              src="https://i.pravatar.cc/40"
              alt="user"
              className="profile-img"
            />
            <span className="text-white ms-2 d-none d-md-block">Manish</span>
          </div>

          <ul className="dropdown-menu dropdown-menu-end mt-2">
            <li><a className="dropdown-item" href="#">My Profile</a></li>
            <li><a className="dropdown-item" href="#">My Teams</a></li>
            <li><a className="dropdown-item" href="#">My Contests</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item text-danger" href="#">Logout</a></li>
          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Header;