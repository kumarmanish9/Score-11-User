import React, { useState, useContext } from "react";
import { FaBell, FaSearch, FaChevronDown } from "react-icons/fa";
import { AuthContext } from "../../Context/AuthContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  .hdr-wrap {
    background: #ffffff;
    border-radius: 20px;
    padding: 16px 24px;
    box-shadow: 0 2px 20px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04);
    font-family: 'DM Sans', sans-serif;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  /* Left */
  .hdr-left h2 {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 800;
    color: #111;
    margin: 0 0 2px;
    letter-spacing: -0.3px;
  }

  .hdr-left p {
    font-size: 13px;
    color: #aaa;
    margin: 0;
    font-weight: 400;
  }

  /* Right */
  .hdr-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  /* Search */
  .hdr-search {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #f6f6f6;
    border: 1.5px solid #efefef;
    border-radius: 12px;
    padding: 8px 14px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .hdr-search:focus-within {
    border-color: #d0d0d0;
    box-shadow: 0 0 0 3px rgba(0,0,0,0.04);
    background: #fff;
  }

  .hdr-search svg {
    color: #bbb;
    flex-shrink: 0;
    font-size: 13px;
  }

  .hdr-search input {
    border: none;
    background: transparent;
    outline: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: #333;
    width: 190px;
  }

  .hdr-search input::placeholder {
    color: #bbb;
  }

  /* Bell */
  .hdr-bell-wrap {
    position: relative;
  }

  .hdr-bell {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: #f6f6f6;
    border: 1.5px solid #efefef;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    color: #666;
    font-size: 15px;
  }

  .hdr-bell:hover {
    background: #f0f0f0;
    transform: scale(1.05);
  }

  .hdr-bell-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    background: #ef4444;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #fff;
    font-family: 'DM Sans', sans-serif;
  }

  /* Divider */
  .hdr-divider {
    width: 1px;
    height: 28px;
    background: #efefef;
    flex-shrink: 0;
  }

  /* Profile dropdown */
  .hdr-profile {
    position: relative;
  }

  .hdr-profile-btn {
    display: flex;
    align-items: center;
    gap: 9px;
    background: #f6f6f6;
    border: 1.5px solid #efefef;
    border-radius: 14px;
    padding: 6px 12px 6px 6px;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
    font-family: 'DM Sans', sans-serif;
  }

  .hdr-profile-btn:hover {
    background: #f0f0f0;
    border-color: #e0e0e0;
  }

  .hdr-avatar {
    width: 30px;
    height: 30px;
    border-radius: 9px;
    object-fit: cover;
    flex-shrink: 0;
  }

  .hdr-username {
    font-size: 13px;
    font-weight: 600;
    color: #222;
    white-space: nowrap;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .hdr-chevron {
    font-size: 10px;
    color: #aaa;
    transition: transform 0.2s;
  }

  .hdr-chevron.open {
    transform: rotate(180deg);
  }

  /* Dropdown menu */
  .hdr-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.05);
    min-width: 170px;
    padding: 6px;
    z-index: 1000;
    animation: dropIn 0.15s ease;
  }

  @keyframes dropIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .hdr-dropdown a {
    display: block;
    padding: 9px 14px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 500;
    color: #333;
    text-decoration: none;
    transition: background 0.15s;
    font-family: 'DM Sans', sans-serif;
  }

  .hdr-dropdown a:hover {
    background: #f5f5f5;
    color: #111;
  }

  .hdr-dropdown-divider {
    height: 1px;
    background: #f0f0f0;
    margin: 4px 6px;
  }

  .hdr-dropdown a.danger {
    color: #ef4444;
  }

  .hdr-dropdown a.danger:hover {
    background: #fff5f5;
    color: #dc2626;
  }

  @media (max-width: 560px) {
    .hdr-wrap { padding: 12px 16px; }
    .hdr-search input { width: 110px; }
    .hdr-username { display: none; }
  }
`;

function Header() {
  const [notifications] = useState(0);
  const [open, setOpen] = useState(false);
  const { user } = useContext(AuthContext);

  return (
    <>
      <style>{styles}</style>
      <div className="hdr-wrap">
        {/* Left */}
        <div className="hdr-left">
          <h2>Dashboard Overview</h2>
          <p>Manage your teams and contests</p>
        </div>

        {/* Right */}
        <div className="hdr-right">
          {/* Search */}
          <div className="hdr-search">
            <FaSearch />
            <input type="text" placeholder="Search matches, players..." />
          </div>

          {/* Bell */}
          <div className="hdr-bell-wrap">
            <button className="hdr-bell">
              <FaBell />
            </button>
            {notifications > 0 && (
              <span className="hdr-bell-badge">{notifications}</span>
            )}
          </div>

          <div className="hdr-divider" />

          {/* Profile */}
          <div className="hdr-profile">
            <button
              className="hdr-profile-btn"
              onClick={() => setOpen((v) => !v)}
            >
              <img
                src={user?.avatar || "https://i.pravatar.cc/40"}
                alt="Profile"
                className="hdr-avatar"
              />
              <span className="hdr-username">{user?.name || "User"}</span>
              <FaChevronDown className={`hdr-chevron ${open ? "open" : ""}`} />
            </button>

            {open && (
              <div className="hdr-dropdown">
                <a href="/profile">Profile</a>
                <a href="/my-teams">My Teams</a>
                <a href="/wallet">Wallet</a>
                <div className="hdr-dropdown-divider" />
                <a href="/logout" className="danger">Logout</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;