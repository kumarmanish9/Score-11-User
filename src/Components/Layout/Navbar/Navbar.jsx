import React, { useState, useEffect, useContext } from "react";
import logo from "../../../assets/Styles/Logo.png";
import { FaSearch, FaBell, FaWallet, FaGooglePlay, FaApple, FaUserCircle, FaBars, FaPlus } from "react-icons/fa";
import "./Navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../../../Services/AuthServices";
import { AuthContext } from "../../../Context/AuthContext";
import { getWalletBalance } from "../../../Services/walletService";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [walletBalance, setWalletBalance] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchWalletBalance();
    }
  }, [user]);

  const fetchWalletBalance = async () => {
    try {
      const balance = await getWalletBalance();
      setWalletBalance(balance || 0);
    } catch (err) {
      console.log('Wallet fetch error:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.log("Logout error:", error);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center fw-bold" to="/">
          <img src={logo} alt="Score11" width="50" height="40" className="me-2 shadow-sm rounded" />
          <div>
            Score<span className="text-primary fw-bolder">11</span>
            <div className="small text-muted">Fantasy Cricket</div>
          </div>
        </Link>

        {/* Mobile toggle */}
        <button className="navbar-toggler border-0 p-2" onClick={() => setMobileOpen(!mobileOpen)} style={{borderRadius: '8px'}}>
          <FaBars size={24} className="text-primary" />
        </button>

        {/* Desktop Nav */}
        <div className={`collapse navbar-collapse ${mobileOpen ? 'show' : ''}`} id="navbarContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            {/* Live Scores */}
            <li className="nav-item dropdown me-3">
              <a className="nav-link dropdown-toggle fw-semibold text-dark px-4 py-2 rounded-pill" href="#" role="button" data-bs-toggle="dropdown">
                Live Scores
              </a>
              <ul className="dropdown-menu shadow-lg border-0 mt-2 rounded-3">
                <li><Link className="dropdown-item px-4 py-3 fw-medium" to="/matches">All Matches</Link></li>
                <li><Link className="dropdown-item px-4 py-3 fw-medium" to="/tournaments">Tournaments</Link></li>
                <li><hr className="dropdown-divider mx-3 my-0" /></li>
                <li><Link className="dropdown-item px-4 py-3 fw-medium text-warning" to="/leaderboard">Leaderboard</Link></li>
              </ul>
            </li>

            {/* Fantasy */}
            <li className="nav-item dropdown me-3">
              <a className="nav-link dropdown-toggle fw-semibold text-dark px-4 py-2 rounded-pill" href="#" role="button" data-bs-toggle="dropdown">
                Fantasy
              </a>
              <ul className="dropdown-menu shadow-lg border-0 mt-2 rounded-3">
                <li><Link className="dropdown-item px-4 py-3 fw-medium" to="/contests">Contests</Link></li>
                <li><Link className="dropdown-item px-4 py-3 fw-semibold text-primary" to="/create-team">Create Team</Link></li>
                <li><Link className="dropdown-item px-4 py-3 fw-medium" to="/teams">My Teams</Link></li>
                <li><Link className="dropdown-item px-4 py-3 fw-medium" to="/players">Player Search</Link></li>
              </ul>
            </li>

            {/* Live & Community */}
            <li className="nav-item dropdown me-3">
              <a className="nav-link dropdown-toggle fw-semibold text-dark px-4 py-2 rounded-pill" href="#" role="button" data-bs-toggle="dropdown">
                Live & Community
              </a>
              <ul className="dropdown-menu shadow-lg border-0 mt-2 rounded-3">
                <li><Link className="dropdown-item px-4 py-3 fw-medium" to="/live">Live Streams</Link></li>
                <li><Link className="dropdown-item px-4 py-3 fw-medium" to="/go-live">Go Live</Link></li>
                <li><hr className="dropdown-divider mx-3 my-0" /></li>
                <li><Link className="dropdown-item px-4 py-3 fw-medium" to="/community">Community</Link></li>
              </ul>
            </li>

            {/* More */}
            <li className="nav-item dropdown me-3">
              <a className="nav-link dropdown-toggle fw-semibold text-dark px-4 py-2 rounded-pill" href="#" role="button" data-bs-toggle="dropdown">
                More
              </a>
              <ul className="dropdown-menu shadow-lg border-0 mt-2 rounded-3">
                <li><Link className="dropdown-item px-4 py-3 fw-medium" to="/blogs">Blogs</Link></li>
                <li><Link className="dropdown-item px-4 py-3 fw-medium" to="/store">Store</Link></li>
                <li><Link className="dropdown-item px-4 py-3 fw-medium" to="/wallet">Wallet</Link></li>
                <li><hr className="dropdown-divider mx-3 my-0" /></li>
                <li><Link className="dropdown-item px-4 py-3 fw-medium" to="/faq">FAQ</Link></li>
              </ul>
            </li>
          </ul>

          {/* Right side */}
          <div className="d-flex align-items-center gap-3">
            {/* Search */}
            <FaSearch size={20} className="cursor-pointer text-gray-500 fs-5" title="Search" style={{cursor: 'pointer'}} />

            {/* Wallet */}
            {user && (
              <div className="position-relative me-3">
                <FaWallet size={20} className="cursor-pointer text-primary fs-5" title="Wallet" style={{cursor: 'pointer'}} />
                <span className="position-absolute -top-2 start-100 translate-middle badge rounded-pill bg-danger">
                  ₹{walletBalance.toLocaleString() || '0'}
                </span>
              </div>
            )}

            {/* Apps */}
            <div className="d-none d-md-flex gap-2">
              <FaGooglePlay size={20} className="cursor-pointer text-success fs-5" title="Android" style={{cursor: 'pointer'}} />
              <FaApple size={20} className="cursor-pointer text-dark fs-5" title="iOS" style={{cursor: 'pointer'}} />
            </div>

            {/* Profile */}
            {!user ? (
              <Link className="btn btn-outline-primary rounded-pill px-4 py-2 fw-semibold border-2 shadow-sm" to="/login">
                Sign In
              </Link>
            ) : (
              <div className="dropdown">
                <a className="d-flex align-items-center text-decoration-none dropdown-toggle cursor-pointer p-2 rounded-pill bg-gray-100" href="#" role="button" data-bs-toggle="dropdown" style={{textDecoration: 'none'}}>
                  {user?.avatar?.url ? (
                    <img 
                      src={user.avatar.url} 
                      alt="profile" 
                      className="rounded-circle me-2" 
                      style={{width: '40px', height: '40px', objectFit: 'cover', border: '2px solid #3B82F6'}}
                    />
                  ) : (
                    <FaUserCircle size={32} className="me-2 text-primary" />
                  )}
                  <span className="d-none d-md-inline fw-semibold text-dark small">{user.name?.split(' ')[0] || 'User'}</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2 rounded-3 p-0" style={{minWidth: '240px'}}>
                  <li>
                    <div className="px-4 py-3 border-bottom bg-gray-50 rounded-top">
                      <strong className="d-block mb-1">{user.name}</strong>
                      <small className="text-muted">{user.email}</small>
                    </div>
                  </li>
                  <li><Link className="dropdown-item px-4 py-3 fw-semibold border-bottom" to="/profile">Profile</Link></li>
                  <li><Link className="dropdown-item px-4 py-3 fw-semibold" to="/dashboard">Dashboard</Link></li>
                  <li><Link className="dropdown-item px-4 py-3 fw-semibold" to="/create-team">Create Team</Link></li>
                  <li><Link className="dropdown-item px-4 py-3 fw-semibold" to="/wallet">Wallet</Link></li>
                  <li><Link className="dropdown-item px-4 py-3 fw-semibold" to="/teams">My Teams</Link></li>
                  <li><Link className="dropdown-item px-4 py-3 fw-semibold" to="/contests">Contests</Link></li>
                  <li><hr className="dropdown-divider mx-3" /></li>
                  <li>
                    <button className="dropdown-item px-4 py-3 text-danger fw-semibold w-100 text-start border-0 bg-transparent" onClick={handleLogout}>
                      Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
