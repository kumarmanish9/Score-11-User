import React, { useState } from "react";
import { FaBell, FaSearch } from "react-icons/fa";

function Topbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const navLinks = [
    { label: "Watch", href: "#", isLive: true },
    { label: "Schedule", href: "#" },
    { label: "Teams", href: "#", active: true },
    { label: "Videos", href: "#" },
    { label: "Stats", href: "#" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');

        @keyframes livePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.45); }
          50%       { box-shadow: 0 0 0 6px rgba(239,68,68,0); }
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes notiBounce {
          0%, 100% { transform: rotate(0deg); }
          25%       { transform: rotate(14deg); }
          75%       { transform: rotate(-10deg); }
        }

        .tb-nav {
          position: sticky;
          top: 0;
          z-index: 1000;
          font-family: 'Sora', sans-serif;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1.5px solid #e8edf5;
          box-shadow: 0 2px 16px rgba(0,0,0,0.05);
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
        }

        .tb-inner {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        /* ── Logo ── */
        .tb-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .tb-logo-icon {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          box-shadow: 0 3px 10px rgba(37,99,235,0.28);
          flex-shrink: 0;
        }
        .tb-logo-text {
          font-size: 18px;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.5px;
        }
        .tb-logo-text span {
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── Search ── */
        .tb-search {
          flex: 1;
          max-width: 320px;
          position: relative;
          margin: 0 auto;
        }
        .tb-search-icon {
          position: absolute;
          left: 13px; top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 13px;
          pointer-events: none;
          transition: color 0.15s;
        }
        .tb-search.focused .tb-search-icon { color: #2563eb; }
        .tb-search-input {
          width: 100%;
          padding: 9px 14px 9px 36px;
          border: 1.5px solid #e2e8f0;
          border-radius: 11px;
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #0f172a;
          background: #f8f9fc;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
        }
        .tb-search-input::placeholder { color: #94a3b8; }
        .tb-search-input:focus {
          border-color: #93c5fd;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.10);
        }

        /* ── Nav links ── */
        .tb-links {
          display: flex;
          align-items: center;
          gap: 2px;
          flex-shrink: 0;
        }
        .tb-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 13px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
        }
        .tb-link:hover {
          background: #f1f5f9;
          color: #0f172a;
          text-decoration: none;
        }
        .tb-link.active {
          background: #eff6ff;
          color: #2563eb;
          font-weight: 700;
        }
        .tb-live-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #ef4444;
          animation: livePulse 1.6s infinite;
          flex-shrink: 0;
        }
        .tb-live-label {
          background: #fef2f2;
          color: #dc2626;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.6px;
          border-radius: 5px;
          padding: 2px 6px;
          text-transform: uppercase;
        }

        /* ── Right actions ── */
        .tb-actions {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
          margin-left: auto;
        }

        /* Bell */
        .tb-bell-btn {
          position: relative;
          width: 38px; height: 38px;
          border-radius: 10px;
          border: 1.5px solid #e8edf5;
          background: #ffffff;
          display: flex; align-items: center; justify-content: center;
          color: #475569;
          font-size: 15px;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s, color 0.15s;
        }
        .tb-bell-btn:hover {
          background: #f8f9fc;
          border-color: #cbd5e1;
          color: #0f172a;
        }
        .tb-bell-btn:hover svg, .tb-bell-btn:hover .fa-bell {
          animation: notiBounce 0.4s ease;
        }
        .tb-noti-dot {
          position: absolute;
          top: 7px; right: 7px;
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #ef4444;
          border: 2px solid #fff;
        }

        /* Profile */
        .tb-profile {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 5px 12px 5px 6px;
          border-radius: 12px;
          border: 1.5px solid #e8edf5;
          background: #ffffff;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
          text-decoration: none;
        }
        .tb-profile:hover {
          background: #f8f9fc;
          border-color: #cbd5e1;
          text-decoration: none;
        }
        .tb-profile-img {
          width: 28px; height: 28px;
          border-radius: 8px;
          object-fit: cover;
          flex-shrink: 0;
          border: 1px solid #e2e8f0;
        }
        .tb-profile-name {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
          white-space: nowrap;
        }

        /* ── Hamburger ── */
        .tb-hamburger {
          display: none;
          width: 38px; height: 38px;
          border-radius: 10px;
          border: 1.5px solid #e8edf5;
          background: #ffffff;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          cursor: pointer;
          margin-left: auto;
          flex-shrink: 0;
        }
        .tb-hamburger span {
          display: block;
          width: 18px; height: 2px;
          border-radius: 2px;
          background: #475569;
          transition: all 0.2s;
        }
        .tb-hamburger.open span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .tb-hamburger.open span:nth-child(2) { opacity: 0; }
        .tb-hamburger.open span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        /* ── Mobile menu ── */
        .tb-mobile-menu {
          display: none;
          flex-direction: column;
          gap: 4px;
          padding: 12px 24px 16px;
          border-top: 1.5px solid #e8edf5;
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(16px);
          animation: fadeDown 0.2s ease both;
        }
        .tb-mobile-menu.open { display: flex; }
        .tb-mobile-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          color: #475569;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
        }
        .tb-mobile-link:hover, .tb-mobile-link.active {
          background: #eff6ff;
          color: #2563eb;
          text-decoration: none;
        }
        .tb-mobile-divider {
          height: 1px;
          background: #f1f5f9;
          margin: 6px 0;
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .tb-search { max-width: 220px; }
          .tb-links { display: none; }
        }
        @media (max-width: 640px) {
          .tb-search { display: none; }
          .tb-actions { display: none; }
          .tb-hamburger { display: flex; }
        }
      `}</style>

      <div style={{ position: "sticky", top: 0, zIndex: 1000 }}>
        {/* ── MAIN BAR ── */}
        <nav className="tb-nav">
          <div className="tb-inner">

            {/* LOGO */}
            <a className="tb-logo" href="#">
              <div className="tb-logo-icon">🏏</div>
              <span className="tb-logo-text">Score<span>11</span></span>
            </a>

            {/* SEARCH */}
            <div className={`tb-search${searchFocused ? " focused" : ""}`}>
              <FaSearch className="tb-search-icon" />
              <input
                type="text"
                className="tb-search-input"
                placeholder="Search matches, teams..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>

            {/* NAV LINKS */}
            <div className="tb-links">
              {navLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className={`tb-link${link.active ? " active" : ""}`}
                >
                  {link.isLive && <span className="tb-live-dot" />}
                  {link.label}
                  {link.isLive && <span className="tb-live-label">Live</span>}
                </a>
              ))}
            </div>

            {/* RIGHT ACTIONS */}
            <div className="tb-actions">
              {/* Bell */}
              <button className="tb-bell-btn">
                <FaBell />
                <span className="tb-noti-dot" />
              </button>

              {/* Profile */}
              <a href="#" className="tb-profile">
                <img
                  src="https://i.pravatar.cc/40"
                  alt="profile"
                  className="tb-profile-img"
                />
                <span className="tb-profile-name">Manish</span>
              </a>
            </div>

            {/* HAMBURGER */}
            <button
              className={`tb-hamburger${menuOpen ? " open" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>

          </div>
        </nav>

        {/* ── MOBILE MENU ── */}
        <div className={`tb-mobile-menu${menuOpen ? " open" : ""}`}>
          {navLinks.map((link, i) => (
            <a
              key={i}
              href={link.href}
              className={`tb-mobile-link${link.active ? " active" : ""}`}
            >
              {link.isLive && <span style={{
                width: 7, height: 7, borderRadius: "50%",
                background: "#ef4444", display: "inline-block"
              }} />}
              {link.label}
              {link.isLive && <span style={{
                background: "#fef2f2", color: "#dc2626",
                fontSize: 10, fontWeight: 800, borderRadius: 5,
                padding: "2px 6px", letterSpacing: "0.6px",
                textTransform: "uppercase"
              }}>Live</span>}
            </a>
          ))}
          <div className="tb-mobile-divider" />
          <a href="#" className="tb-mobile-link" style={{ gap: 10 }}>
            <img
              src="https://i.pravatar.cc/40"
              alt="profile"
              style={{ width: 26, height: 26, borderRadius: 8, objectFit: "cover" }}
            />
            Manish
          </a>
        </div>
      </div>
    </>
  );
}

export default Topbar;