import React, { useState, useEffect } from "react";
import { FaBell, FaSearch } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import "./Header.css";

function Header() {
  const [notifications, setNotifications] = useState(0);
  const { user } = useContext(AuthContext);

  return (
    <div className="card shadow-md mb-4">
      <div className="card-body p-4">
        <div className="row align-items-center g-3">
          {/* Left - Dashboard Title */}
          <div className="col-md-6">
            <h2 className="h4 mb-0 fw-bold text-gray-900">
              Dashboard Overview
            </h2>
            <p className="text-muted mb-0">Manage your teams and contests</p>
          </div>

          {/* Right - Search & Actions */}
          <div className="col-md-6">
            <div className="d-flex align-items-center gap-2 justify-content-md-end">
              {/* Notification */}
              <div className="position-relative">
                <button className="btn btn-outline-gray-300 p-3 rounded-circle hover-lift" style={{width: '48px', height: '48px'}}>
                  <FaBell />
                </button>
                {notifications > 0 && (
                  <span className="position-absolute badge bg-blue-500 text-white" style={{top: '-4px', right: '-4px', fontSize: '0.7rem'}}>
                    {notifications}
                  </span>
                )}
              </div>

              {/* Search */}
              <div className="flex-grow-1 flex-shrink-0" style={{maxWidth: '300px'}}>
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-white border-gray-300">
                    <FaSearch className="text-gray-500" size={14} />
                  </span>
                  <input
                    type="text"
                    className="form-control border-gray-300"
                    placeholder="Search matches, players..."
                  />
                </div>
              </div>

              {/* Profile */}
              <div className="dropdown">
                <button 
                  className="btn btn-white d-flex align-items-center gap-2 p-2 hover-lift shadow-sm" 
                  data-bs-toggle="dropdown"
                >
                  <img
                    src={user?.avatar || "https://i.pravatar.cc/40"}
                    alt="Profile"
                    className="rounded-circle"
                    style={{width: '36px', height: '36px'}}
                  />
                  <span className="d-none d-md-inline fw-semibold text-gray-900">
                    {user?.name || 'User'}
                  </span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-1">
                  <li><a className="dropdown-item fw-semibold" href="/profile">Profile</a></li>
                  <li><a className="dropdown-item fw-semibold" href="/my-teams">My Teams</a></li>
                  <li><a className="dropdown-item fw-semibold" href="/wallet">Wallet</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item fw-semibold text-danger" href="/logout">Logout</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
