import React, { useState } from "react";
import "../Components/PagesCss/ForgotPassword.css";
import { sendOtp } from "../Services/AuthServices";
import { useNavigate, Link } from "react-router-dom";
import { FaKey, FaEnvelope, FaShieldAlt, FaArrowLeft } from "react-icons/fa";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const res = await sendOtp({ email });

      if (!res.data?.success) {
        setError(res.data?.message || "Failed to send OTP");
        return;
      }

      setSuccess("OTP sent successfully! Check your email.");
      setTimeout(() => navigate("/verify-otp", { state: { email } }), 2000);

    } catch (error) {
      const msg = error.response?.data?.message || "Something went wrong";
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
            <rect x="580" y="220" width="40" height="160" rx="20" fill="#F59E0B" stroke="#B45309" strokeWidth="4" filter="url(#glow)"/>
            <circle cx="600" cy="200" r="25" fill="#D97706"/>
            <path d="M 550 150 Q 600 100 650 150" stroke="#FBBF24" strokeWidth="12" strokeLinecap="round" fill="none" filter="url(#glow)"/>
          </g>
        </svg>
        <div className="hero-text">
          <h1 className="stadium-title">
            Score<span className="logo-highlight">11</span>
          </h1>
          <p className="stadium-subtitle">Reset Password • Get Back in the Game</p>
        </div>
      </div>

      <div className="auth-form-container">
        <div className="auth-card forgot-card">
          <div className="logo-section">
            <div className="lock-logo">
              <svg viewBox="0 0 60 60">
                <path d="M 15 25 Q 30 15 45 25 V 45 Q 45 55 35 55 H 25 Q 15 55 15 45 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="3" rx="5"/>
                <circle cx="30" cy="22" r="8" fill="#EF4444"/>
                <rect x="20" y="40" width="20" height="8" rx="4" fill="#6B7280"/>
              </svg>
            </div>
            <h2>Reset Password</h2>
            <p>Enter email to receive OTP</p>
          </div>

          {error && <div className="alert alert-danger shadow-sm">{error}</div>}
          {success && <div className="alert alert-success shadow-sm">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
<FaEnvelope className="label-icon" />
                Email Address
              </label>
              <input
                type="email"
                placeholder="player@score11.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-cricket">
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Sending OTP...
                </>
              ) : (
                <>
                  <FaShieldAlt className="me-2" />
                  Send Reset OTP
                </>
              )}
            </button>
          </form>

          <div className="auth-links">
            <Link to="/login" className="back-link">
              <FaArrowLeft className="me-1" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
