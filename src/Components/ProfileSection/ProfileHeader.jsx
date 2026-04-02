import React from "react";
import "./ProfileHeader.css";

function ProfileHeader({ user }) {
  return (
    <div className="profile-header">

      {/* 🔹 Left Section (Avatar + Info) */}
      <div className="profile-left">
        <img
          src={user?.avatar?.url || "https://via.placeholder.com/80"}
          alt="avatar"
          className="profile-avatar"
        />
  
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