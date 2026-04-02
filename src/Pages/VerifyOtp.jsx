import React, { useState } from "react";
import "../Components/PagesCss/VerifyOtp.css";
import { Link } from "react-router-dom";

function VerifyOtp() {

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // ❌ No API call yet
    console.log("OTP Entered:", otp);

    alert("OTP verification will be implemented later");
  };

  return (
    <div className="otp-container">
      <div className="otp-card">
        <h2>Verify OTP</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

        </form>

        {/* 🔹 Resend OTP */}
        <p className="resend">
          Didn't receive OTP? 
          <span> Resend</span>
        </p>

        {/* 🔹 Back link */}
        <Link to="/forgot-password" className="back-link">
          ← Back
        </Link>
      </div>
    </div>
  );
}

export default VerifyOtp;