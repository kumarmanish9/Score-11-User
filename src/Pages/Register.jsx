import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Components/PagesCss/Register.css";
import { registerUser } from "../Services/AuthServices";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaUserPlus, FaStar, FaShieldAlt } from "react-icons/fa";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "user",
    isPro: false
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

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setForm({
      ...form,
      role: newRole,
      isPro: newRole === "pro"
    });
  };

  const handleProToggle = (e) => {
    setForm({
      ...form,
      isPro: e.target.checked,
      role: e.target.checked ? "pro" : "user"
    });
  };

  const validateForm = () => {
    if (!form.email || !form.email.toLowerCase().trim()) {
      setError("Email is required");
      return false;
    }

    // Email validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email");
      return false;
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(form.phone)) {
      setError("Please enter a valid phone number (e.g., +91 9876543210)");
      return false;
    }

    // Password strength
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (!/(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      setError("Password must contain at least one uppercase letter and one number");
      return false;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (!form.name?.trim()) {
      setError("Name is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    const payload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      password: form.password,
      role: form.role
    };

    console.log("Registration Payload:", payload);

    try {
      setLoading(true);
      const res = await registerUser(payload);
      
      if (res.data?.accessToken) {
        localStorage.setItem("token", res.data.accessToken);
      }
      
      navigate("/dashboard");
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Registration failed";
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
          <p className="stadium-subtitle">Create Pro Account • Role-Based Registration</p>
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
            <p>Complete registration with role selection</p>
          </div>

          {error && <div className="alert alert-danger shadow-sm">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <FaUser className="label-icon" />
                  Full Name *
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
              <div className="form-group">
                <label className="form-label">
                  <FaEnvelope className="label-icon" />
                  Email *
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
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <FaPhone className="label-icon" />
                  Phone *
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
              <div className="form-group">
                <label className="form-label">
                  <FaLock className="label-icon" />
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Min 8 chars (1 Upper, 1 Number)"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength="8"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <FaLock className="label-icon" />
                Confirm Password *
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

            <div className="form-group">
              <label className="form-label">
                <FaStar className="label-icon" />
                Role *
              </label>
              <select name="role" value={form.role} onChange={handleRoleChange} className="form-select" required>
                <option value="user">Regular User</option>
                <option value="player">Player</option>
                <option value="scorer">Scorer</option>
                <option value="pro">Pro Scorer</option>
              </select>
            </div>

            {form.isPro && (
              <div className="pro-section">
                <label className="pro-checkbox">
                  <FaShieldAlt className="pro-icon" /> Pro Account - Admin verification required
                </label>
                <p className="pro-disclaimer small">
                  Pro accounts enable live scoring. Verification takes 24-48 hours.
                </p>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-cricket">
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Creating Account...
                </>
              ) : (
                <>
                  <FaUserPlus className="me-2" />
                  Create {form.role === 'pro' ? 'Pro ' : ''}{form.role.charAt(0).toUpperCase() + form.role.slice(1)} Account
                </>
              )}
            </button>
          </form>

          <div className="auth-links">
            <div className="divider">
              <span>or</span>
            </div>
            <p>
              Already have account? <Link to="/login" className="highlight-link">Sign In</Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .pro-section {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          padding: 12px;
          border-radius: 12px;
          margin: 12px 0;
          border-left: 4px solid #d97706;
        }
        .pro-checkbox {
          display: flex;
          align-items: center;
          font-weight: 600;
          color: #b45309;
        }
        .pro-icon {
          margin-right: 8px;
          color: #dc2626;
        }
        .pro-disclaimer {
          font-size: 0.85rem;
          color: #92400e;
          margin: 4px 0 0 0;
          font-style: italic;
        }
        .form-select {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          background: white;
          font-size: 1rem;
          transition: all 0.2s;
        }
        .form-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .small { font-size: 0.8rem; }
      `}</style>
    </div>
  );
}

export default Register;

