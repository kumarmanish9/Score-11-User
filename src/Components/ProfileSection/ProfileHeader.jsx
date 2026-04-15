import React from "react";
import "./ProfileHeader.css";
import { FaCamera } from "react-icons/fa";
import defaultAvatar from "../../assets/Styles/Logo.png";

const getSafeAvatarUrl = (avatar) => {
  if (!avatar?.url || avatar.url.includes('users/avatar') || avatar.url.includes('68.178.171.95')) {
    return defaultAvatar;
  }
  // Check if Cloudinary URL (safe public URL)
  if (avatar.url.includes('res.cloudinary.com')) {
    return avatar.url;
  }
  // Fallback proxy through backend (if implemented)
  return `${avatar.url}?proxy=true` || defaultAvatar;
};

function ProfileHeader({ user }) {
  return (
    <div className="profile-header">
      {/* 🔹 Left Section (Avatar + Info) */}
      <div className="profile-left">
        <div className="profile-avatar-wrapper">
          <img
            src={getSafeAvatarUrl(user?.avatar)}
            alt="avatar"
            className="profile-avatar"
            title="Change profile photo in Account tab"
            onError={(e) => {
              e.target.src = defaultAvatar;
              e.target.onError = null;
            }}
          />
          <div className="avatar-edit-overlay">
            <FaCamera size={16} className="edit-icon" title="Edit Photo" />
          </div>
        </div>

        <div className="profile-info">
          <h2>{user?.fullName || user?.name}</h2>
          <p className="username">@{user?.username}</p>
          <p className="email">{user?.email}</p>
          <p className="level">
            Level {user?.level} • {user?.title}
          </p>
        </div>
      </div>

      {/* 🔹 Right Section (Top Stats Cards) */}
      <div className="profile-stats">
        <div className="stat-card">
          <p>Matches</p>
          <h3>{user?.cricketProfile?.matchesPlayed}</h3>
        </div>

        <div className="stat-card">
          <p>Runs</p>
          <h3>{user?.cricketProfile?.totalRuns}</h3>
        </div>

        <div className="stat-card">
          <p>Wickets</p>
          <h3>{user?.cricketProfile?.totalWickets}</h3>
        </div>

        <div className="stat-card">
          <p>High Score</p>
          <h3>{user?.cricketProfile?.highestScore}</h3>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
export { getSafeAvatarUrl };
