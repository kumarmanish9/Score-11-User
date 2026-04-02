import React from "react";
import "./AccountSection.css";

function AccountSection({ user }) {

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="account-section">
      <h3>Account Info</h3>

      <div className="account-grid">

        {/* Email Verified */}
        <div className="account-card">
          <p>Email Verified</p>
          <span className={user?.isEmailVerified ? "status yes" : "status no"}>
            {user?.isEmailVerified ? "✔ Verified" : "✖ Not Verified"}
          </span>
        </div>

        {/* Profile Complete */}
        <div className="account-card">
          <p>Profile Complete</p>
          <span className={user?.isProfileComplete ? "status yes" : "status no"}>
            {user?.isProfileComplete ? "✔ Completed" : "✖ Incomplete"}
          </span>
        </div>

        {/* Last Login */}
        <div className="account-card">
          <p>Last Login</p>
          <h4>{formatDate(user?.lastLogin)}</h4>
        </div>

        {/* Created Date */}
        <div className="account-card">
          <p>Joined On</p>
          <h4>{formatDate(user?.createdAt)}</h4>
        </div>

      </div>
    </div>
  );
}

export default AccountSection;