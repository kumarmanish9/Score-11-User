import React from "react";
import "./Topbar.css";
import { FaBell, FaSearch } from "react-icons/fa";

function Topbar() {
  return (
    <nav className="navbar navbar-expand-lg topbar">
      <div className="container-fluid">

        {/* 🔷 LEFT - LOGO */}
        <a className="navbar-brand logo" href="#">
          🏏 Score11
        </a>

        {/* 🔷 TOGGLER (Mobile) */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* 🔷 CENTER + RIGHT */}
        <div className="collapse navbar-collapse" id="navbarContent">

          {/* 🔷 CENTER - SEARCH */}
          <div className="mx-auto search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="form-control"
              placeholder="Search matches, teams..."
            />
          </div>

          {/* 🔷 RIGHT - MENU ITEMS */}
          <ul className="navbar-nav ms-auto align-items-center">

            <li className="nav-item">
              <a className="nav-link live" href="#">
                Watch <span className="badge bg-danger">LIVE</span>
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#">Schedule</a>
            </li>

            <li className="nav-item">
              <a className="nav-link active" href="#">Teams</a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#">Videos</a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#">Stats</a>
            </li>

            {/* 🔔 Notification */}
            <li className="nav-item icon">
              <FaBell />
              <span className="notification-dot"></span>
            </li>

            {/* 👤 Profile */}
            <li className="nav-item profile">
              <img
                src="https://i.pravatar.cc/40"
                alt="profile"
                className="profile-img"
              />
              <span>Manish</span>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Topbar;