import React, { useState } from "react";
import "../Components/PagesCss/ResetPassword.css";
import { useNavigate } from "react-router-dom";

function ResetPassword() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    // ❌ No API yet
    console.log("New Password:", form.newPassword);

    alert("Password reset will be implemented later");

    // Optional redirect
    navigate("/");
  };

  return (
    <div className="reset-container">
      <div className="reset-card">
        <h2>Reset Password</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="password"
            name="newPassword"
            placeholder="Enter New Password"
            value={form.newPassword}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Reset Password"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
