import React, { useState, useEffect } from "react";
import logo from "../../../assets/Styles/Logo.png";
import { FaSearch, FaGooglePlay, FaApple, FaUserCircle } from "react-icons/fa";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { logoutUser } from "../Services/AuthServices";

function Navbar() {
 const location = useLocation();

if (location.pathname === "/login" || location.pathname === "/register") {
  return null;
}
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState(null); // ✅ state added
  const navigate = useNavigate();

  // ✅ get token when component loads
useEffect(() => {
  const checkToken = () => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  };

  // initial check
  checkToken();

  // listen for changes (important 🔥)
  window.addEventListener("storage", checkToken);

  // cleanup
  return () => {
    window.removeEventListener("storage", checkToken);
  };
}, []);

const handleLogout = async () => {
  console.log("Logout clicked");
  try {
    await logoutUser(); // ✅ call backend

    // ✅ clear storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // 🔥 update navbar instantly
    window.dispatchEvent(new Event("storage"));

    // ✅ redirect
    navigate("/login");

  } catch (error) {
    console.log("Logout error:", error.response?.data || error.message);

    // fallback logout
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  }
};

  return (
    <nav className="navbar navbar-expand-lg border-bottom fixed-top">
      <div className="container">

        {/* LEFT - LOGO */}
        <a className="navbar-brand d-flex align-items-center" href="#">
          <img src={logo} alt="logo" width="60" height="40" className="me-2" />
          <div>
            <strong>
              Score<span style={{ color: "red" }}>11</span>
            </strong>
            <div style={{ fontSize: "10px", color: "#777" }}>
              Your cricket matters
            </div>
          </div>
        </a>

        {/* MOBILE TOGGLE */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* NAV CONTENT */}
        <div className="collapse navbar-collapse" id="navbarContent">

          {/* CENTER MENU */}
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                Live Scores
              </a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#">Matches</a></li>
                <li><a className="dropdown-item" href="#">Results</a></li>
              </ul>
            </li>

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                Network
              </a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#">Clubs</a></li>
                <li><a className="dropdown-item" href="#">Teams</a></li>
                <li><a className="dropdown-item" href="#">Players</a></li>
              </ul>
            </li>

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                Add ons
              </a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#">Scoring App</a></li>
                <li><a className="dropdown-item" href="#">Live Streaming</a></li>
              </ul>
            </li>

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                More
              </a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#">About</a></li>
                <li><a className="dropdown-item" href="#">Blog</a></li>
              </ul>
            </li>

            <li className="nav-item"><a className="nav-link" href="#">Store</a></li>
            <li className="nav-item"><a className="nav-link" href="#">Jobs</a></li>
            <li className="nav-item"><a className="nav-link" href="#">Contact Us</a></li>
          </ul>

          {/* RIGHT SECTION */}
          <div className="d-flex align-items-center gap-3">

            <FaGooglePlay size={20} style={{ cursor: "pointer" }} />
            <FaApple size={20} style={{ cursor: "pointer" }} />

            {/* 🔥 CONDITIONAL UI */}
            {!token ? (
              <Link 
                to="/login" 
                className="btn btn-outline-success rounded-pill px-3"
              >
                Sign In
              </Link>
            ) : (
              <div style={{ position: "relative" }}>
                
                <FaUserCircle 
                  size={24} 
                  style={{ cursor: "pointer" }}
                  onClick={() => setOpen(!open)}
                />

                {open && (
                  <div className="profile-dropdown">
                    <p onClick={() => navigate("/profile")}>My Profile</p>
                    <p onClick={handleLogout}>Logout</p>
                  </div>
                )}
              </div>
            )}

            <FaSearch size={18} style={{ cursor: "pointer" }} />

          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;