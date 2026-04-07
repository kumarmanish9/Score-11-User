import React, { useState, useContext } from "react";
import "../Components/PagesCss/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../Services/AuthServices";
import { AuthContext } from "../Context/AuthContext";
import { FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await loginUser(form);

      const user = res.data?.data?.user;
      const token = res.data?.data?.accessToken;

      if (!token || !user) {
        setError("Login failed: Invalid response");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      navigate("/dashboard");

    } catch (error) {
      const msg = error.response?.data?.message || "Invalid email or password";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container cricket-bg">
      <div className="stadium-hero">
        <svg className="stadium-svg" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="stadiumGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981"/>
              <stop offset="50%" stopColor="#059669"/>
              <stop offset="100%" stopColor="#047857"/>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <rect className="pitch" x="200" y="200" width="800" height="200" rx="20" fill="#D97706" filter="url(#glow)"/>
          <circle cx="600" cy="300" r="80" fill="#F59E0B" stroke="#B45309" strokeWidth="8" filter="url(#glow)"/>
          <path d="M 300 280 Q 450 200 600 280 T 900 280" stroke="#FBBF24" strokeWidth="20" strokeLinecap="round" fill="none" filter="url(#glow)"/>
          <path d="M 300 320 Q 450 400 600 320 T 900 320" stroke="#F59E0B" strokeWidth="20" strokeLinecap="round" fill="none" filter="url(#glow)"/>
          <circle cx="520" cy="300" r="12" fill="#EF4444"/>
          <circle cx="680" cy="300" r="12" fill="#EF4444"/>
          <g className="batsman">
            <rect x="580" y="220" width="40" height="160" rx="20" fill="#3B82F6" filter="url(#glow)"/>
            <circle cx="600" cy="200" r="25" fill="#1E40AF"/>
          </g>
          <path d="M 550 150 Q 600 100 650 150" stroke="#FBBF24" strokeWidth="12" strokeLinecap="round" fill="none" filter="url(#glow)"/>
        </svg>
        <h1 className="stadium-title">
          <span className="score11-logo">Score<span className="logo-highlight">11</span></span>
        </h1>
        <p className="stadium-subtitle">Join the Ultimate Cricket Fantasy League</p>
      </div>

      <div className="auth-form-container">
        <div className="auth-card login-card">
          <div className="logo-section">
            <div className="cricket-ball-logo">
              <svg viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="28" fill="#EF4444" stroke="#DC2626" strokeWidth="2"/>
                <path d="M 15 15 Q 30 5 45 15 Q 55 25 45 35 Q 30 45 15 35 Q 5 25 15 15" stroke="#F87171" strokeWidth="3" fill="none" strokeLinecap="round"/>
                <path d="M 15 45 Q 30 55 45 45 Q 55 35 45 25 Q 30 15 15 25 Q 5 35 15 45" stroke="#F87171" strokeWidth="3" fill="none" strokeLinecap="round"/>
              </svg>
            </div>
            <h2>Welcome Back</h2>
            <p>Sign in to continue your fantasy journey</p>
          </div>

          {error && <div className="alert alert-danger shadow-sm">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
<FaEnvelope className="label-icon" />
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="player@score11.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <FaLock className="label-icon" />
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-cricket">
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Signing In...
                </>
              ) : (
                <>
<FaArrowRight className="me-2" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="auth-links">
            <Link to="/forgot-password" className="forgot-link">
              Forgot Password?
            </Link>
            <div className="divider">
              <span>or</span>
            </div>
            <p>
              New to Score11?{" "}
              <Link to="/register" className="highlight-link">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;