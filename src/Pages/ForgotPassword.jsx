import React, { useState } from "react";
import "../Components/PagesCss/ForgotPassword.css";
import { sendOtp } from "../Services/AuthServices";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // ✅ Call API
      const res = await sendOtp({ email });

      console.log("Send OTP Response:", res.data);

      // ✅ Check success
      if (!res.data?.success) {
        alert(res.data?.message || "Failed to send OTP ❌");
        return;
      }

      // ✅ Success
      alert("OTP sent successfully ✅");

      // 🔥 Redirect + pass email
      navigate("/verify-otp", { state: { email } });

    } catch (error) {
      console.log("Error:", error.response?.data || error.message);

      alert(
        error.response?.data?.message || "Something went wrong ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <h2>Forgot Password</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>

        </form> 
      </div>
    </div>
  );
}

export default ForgotPassword;