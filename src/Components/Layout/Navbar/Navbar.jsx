import React, { useState, useEffect, useContext } from "react";
import logo from "../../../assets/Styles/Logo.png";
import { FaSearch, FaGooglePlay, FaApple, FaUserCircle } from "react-icons/fa";
import "./Navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../../../Services/AuthServices";
import { AuthContext } from "../../../Context/AuthContext";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Context (MAIN FIX 🔥)
  const { user, setUser } = useContext(AuthContext);

  const [open, setOpen] = useState(false);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const closeDropdown = () => setOpen(false);
    window.addEventListener("click", closeDropdown);
    return () => window.removeEventListener("click", closeDropdown);
  }, []);

  // ✅ Logout
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.log("Logout error:", error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);   // 🔥 instant update (no refresh)

    navigate("/login");
  };

  // ✅ Hide navbar on auth pages
  //  const hideNavbarRoutes = ["/login", "/register", "/dashboard"];

  // if (hideNavbarRoutes.includes(location.pathname)) {
  //   return null;
  // }


  return (
    <nav className="navbar navbar-expand-lg border-bottom fixed-top">
      <div className="container">

        {/* LOGO */}
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

        {/* MOBILE */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">

          {/* MENU */}
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            {/* Live Score */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="liveScoresDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Live Scores
              </a>

              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#">Matches</a></li>
                <li><a className="dropdown-item" href="#">Tournaments</a></li>
                <li><a className="dropdown-item" href="#">Associations</a></li>
              </ul>
            </li>
            {/* Network */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="networkDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Network
              </a>

              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#">Community</a></li>
                <li><a className="dropdown-item" href="#">Looking</a></li>
              </ul>
            </li>
            {/* Ads ons */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="addonsDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Add ons
              </a>

              <ul className="dropdown-menu" aria-labelledby="addonsDropdown">

                <li><a className="dropdown-item" href="#">Score11 PRO</a></li>

                {/* 🔥 Submenu Start */}
                <li className="dropdown-submenu position-relative">
                  <a className="dropdown-item dropdown-toggle" href="#">
                    Go Live
                  </a>

                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#">with camera</a></li>
                    <li><a className="dropdown-item" href="#">with phone</a></li>
                  </ul>
                </li>
                {/* 🔥 Submenu End */}

                <li><a className="dropdown-item" href="#">Your App</a></li>
                <li><a className="dropdown-item" href="#">Your Web</a></li>
                <li><a className="dropdown-item" href="#">Super Sponsor</a></li>

              </ul>
            </li>
            {/* More */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="moreDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                More
              </a>

              <ul className="dropdown-menu" aria-labelledby="moreDropdown">
                <li><a className="dropdown-item" href="#">Tournament Guide</a></li>
                <li><a className="dropdown-item" href="#">Cricket Tips</a></li>
                <li><a className="dropdown-item" href="#">FAQs</a></li>
                <li><a className="dropdown-item" href="#">Blogs</a></li>
                <li><a className="dropdown-item" href="#">Organize Tournaments</a></li>
                <li><a className="dropdown-item" href="#">CrickHeroes Awards</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="#">Support</a></li>
              </ul>
            </li>
            <li className="nav-item"><a className="nav-link" href="#">Store</a></li>
            <li className="nav-item"><a className="nav-link" href="#">Jobs</a></li>
            <li className="nav-item"><a className="nav-link" href="#">Contact Us</a></li>
          </ul>

          {/* RIGHT */}
          <div className="d-flex align-items-center gap-3">

            <FaGooglePlay size={20} style={{ cursor: "pointer" }} />
            <FaApple size={20} style={{ cursor: "pointer" }} />

            {/* ✅ LOGIN / PROFILE SWITCH */}
            {!user ? (
              <Link
                to="/login"
                className="btn btn-outline-success rounded-pill px-3"
              >
                Sign In
              </Link>
            ) : (
              <div style={{ position: "relative" }}>

                {/* 🔥 Profile Icon (from user) */}
                {user?.avatar?.url ? (
                  <img
                    src={user.avatar.url}
                    alt="profile"
                    className="profile-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpen(!open);
                    }}
                  />
                ) : (
                  <FaUserCircle
                    size={26}
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpen(!open);
                    }}
                  />
                )}

                {/* DROPDOWN */}
                {open && (
                  <div
                    className="profile-dropdown"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className="profile-item"
                      onClick={() => {
                        setOpen(false);
                        navigate("/profile");
                      }}
                    >
                      My Profile
                    </div>
                    <div
                      className="profile-item"
                      onClick={() => {
                        setOpen(false);
                        navigate("/matches");
                      }}
                    >
                      Matches
                    </div>
                    <div
                      className="profile-item"
                      onClick={() => {
                        setOpen(false);
                        navigate("/players");
                      }}
                    >
                      Players
                    </div>

                    <div
                      className="profile-item logout"
                      onClick={() => {
                        setOpen(false);
                        handleLogout();
                      }}
                    >
                      Logout
                    </div>
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