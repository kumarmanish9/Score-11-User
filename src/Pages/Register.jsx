import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Components/PagesCss/Register.css";
import { registerUser } from "../Services/AuthServices";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaUserPlus } from "react-icons/fa";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
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

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // const payload = {
    //   username: form.username,
    //   fullName: form.name,
    //   email: form.email,
    //   phone: form.phone,
    //   password: form.password
    // };

    const payload = {
      name: form.name,          // ✅ NOT fullName
      email: form.email,
      phone: form.phone,
      password: form.password
    };

    // 👇 ADD THIS HERE
    console.log("PHONE VALUE:", form.phone);
    console.log("PAYLOAD:", payload);

    try {
      setLoading(true);
      const res = await registerUser(payload);
      navigate("/login");
    } catch (error) {
      const msg = error.response?.data?.message || "Registration Failed";
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
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect className="pitch" x="200" y="200" width="800" height="200" rx="20" fill="#D97706" filter="url(#glow)" />
          <circle cx="600" cy="300" r="80" fill="#F59E0B" stroke="#B45309" strokeWidth="8" filter="url(#glow)" />
          <path d="M 300 280 Q 450 200 600 280 T 900 280" stroke="#FBBF24" strokeWidth="20" strokeLinecap="round" fill="none" filter="url(#glow)" />
          <path d="M 300 320 Q 450 400 600 320 T 900 320" stroke="#F59E0B" strokeWidth="20" strokeLinecap="round" fill="none" filter="url(#glow)" />
          <circle cx="520" cy="300" r="12" fill="#EF4444" />
          <circle cx="680" cy="300" r="12" fill="#EF4444" />
          <g className="batsman">
            <rect x="580" y="220" width="40" height="160" rx="20" fill="#F59E0B" stroke="#B45309" strokeWidth="4" filter="url(#glow)" />
            <circle cx="600" cy="200" r="25" fill="#D97706" />
            <path d="M 550 150 Q 600 100 650 150" stroke="#FBBF24" strokeWidth="12" strokeLinecap="round" fill="none" filter="url(#glow)" />
          </g>
        </svg>
        <div className="hero-text">
          <h1 className="stadium-title">
            Score<span className="logo-highlight">11</span>
          </h1>
          <p className="stadium-subtitle">Create Account • Play Fantasy Cricket</p>
        </div>
      </div>

      <div className="auth-form-container">
        <div className="auth-card register-card">
          <div className="logo-section">
            <div className="cricket-bat-logo">
              <svg viewBox="0 0 60 60">
                <path d="M 10 10 L 50 50 M 10 50 L 50 10" stroke="#3B82F6" strokeWidth="8" strokeLinecap="round" fill="none" />
                <rect x="25" y="5" width="10" height="50" rx="5" fill="#1E40AF" />
                <circle cx="30" cy="55" r="5" fill="#F59E0B" />
              </svg>
            </div>
            <h2>Join Score11</h2>
            <p>Create your player account</p>
          </div>

          {error && <div className="alert alert-danger shadow-sm">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <FaUser className="label-icon" />
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="@player11"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  <FaUser className="label-icon" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
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
                  <FaPhone className="label-icon" />
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <FaLock className="label-icon" />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  <FaLock className="label-icon" />
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Repeat password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-cricket">
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  <FaUserPlus className="me-2" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="auth-links">
            <div className="divider">
              <span>or</span>
            </div>
            <p>
              Already have account?{" "}
              <Link to="/login" className="highlight-link">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
