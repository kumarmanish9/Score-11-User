import React from "react";
import { FaCamera } from "react-icons/fa";
import defaultAvatar from "../../assets/Styles/Logo.png";

const getSafeAvatarUrl = (avatar) => {
  if (!avatar?.url || avatar.url.includes("users/avatar") || avatar.url.includes("68.178.171.95")) {
    return defaultAvatar;
  }
  if (avatar.url.includes("res.cloudinary.com")) {
    return avatar.url;
  }
  return `${avatar.url}?proxy=true` || defaultAvatar;
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  .ph-wrap {
    background: #fff;
    border-radius: 24px;
    padding: 28px;
    box-shadow: 0 2px 20px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04);
    font-family: 'DM Sans', sans-serif;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    flex-wrap: wrap;
  }

  /* ── Left ── */
  .ph-left {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-shrink: 0;
  }

  /* Avatar */
  .ph-avatar-wrap {
    position: relative;
    flex-shrink: 0;
    cursor: pointer;
  }

  .ph-avatar {
    width: 80px;
    height: 80px;
    border-radius: 22px;
    object-fit: cover;
    border: 2px solid #f0f0f0;
    display: block;
    transition: filter 0.2s;
  }

  .ph-avatar-wrap:hover .ph-avatar {
    filter: brightness(0.82);
  }

  .ph-avatar-overlay {
    position: absolute;
    inset: 0;
    border-radius: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
    pointer-events: none;
  }

  .ph-avatar-wrap:hover .ph-avatar-overlay {
    opacity: 1;
  }

  .ph-camera-icon {
    color: #fff;
    font-size: 18px;
    filter: drop-shadow(0 1px 3px rgba(0,0,0,0.4));
  }

  /* Online dot */
  .ph-online-dot {
    position: absolute;
    bottom: 6px;
    right: 6px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #22c55e;
    border: 2px solid #fff;
  }

  /* Info */
  .ph-info {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .ph-name {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 800;
    color: #111;
    margin: 0;
    letter-spacing: -0.4px;
    line-height: 1.15;
  }

  .ph-username {
    font-size: 13px;
    font-weight: 500;
    color: #aaa;
    margin: 0;
  }

  .ph-email {
    font-size: 12px;
    color: #bbb;
    margin: 0;
  }

  .ph-level {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 4px;
  }

  .ph-level-pill {
    background: #f5f5f5;
    border: 1px solid #efefef;
    border-radius: 20px;
    padding: 3px 10px;
    font-size: 11px;
    font-weight: 700;
    color: #666;
    letter-spacing: 0.03em;
  }

  .ph-title-pill {
    background: #fef9c3;
    border: 1px solid #fde68a;
    border-radius: 20px;
    padding: 3px 10px;
    font-size: 11px;
    font-weight: 700;
    color: #b45309;
    letter-spacing: 0.03em;
  }

  /* ── Right stats ── */
  .ph-stats {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .ph-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    background: #fafafa;
    border: 1.5px solid #efefef;
    border-radius: 16px;
    padding: 14px 20px 12px;
    min-width: 80px;
    transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
    position: relative;
    overflow: hidden;
  }

  .ph-stat:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 18px rgba(0,0,0,0.08);
    border-color: #e0e0e0;
  }

  .ph-stat:nth-child(1)::before { background: linear-gradient(90deg,#6366f1,#8b5cf6); }
  .ph-stat:nth-child(2)::before { background: linear-gradient(90deg,#f5c500,#fb923c); }
  .ph-stat:nth-child(3)::before { background: linear-gradient(90deg,#ef4444,#f97316); }
  .ph-stat:nth-child(4)::before { background: linear-gradient(90deg,#22c55e,#4ade80); }

  .ph-stat::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    border-radius: 3px 3px 0 0;
  }

  .ph-stat-value {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 800;
    color: #111;
    line-height: 1;
    margin: 0;
    letter-spacing: -0.5px;
  }

  .ph-stat-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: #bbb;
    margin: 0;
  }

  /* Responsive */
  @media (max-width: 640px) {
    .ph-wrap { flex-direction: column; align-items: flex-start; }
    .ph-stats { width: 100%; justify-content: space-between; }
    .ph-stat  { flex: 1; min-width: 70px; }
  }
`;

const STAT_ICONS = ["🏏", "🏃", "🎯", "⭐"];

function ProfileHeader({ user }) {
  const stats = [
    { label: "Matches",    value: user?.cricketProfile?.matchesPlayed },
    { label: "Runs",       value: user?.cricketProfile?.totalRuns     },
    { label: "Wickets",    value: user?.cricketProfile?.totalWickets  },
    { label: "High Score", value: user?.cricketProfile?.highestScore  },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="ph-wrap">

        {/* Left — avatar + info */}
        <div className="ph-left">
          <div className="ph-avatar-wrap" title="Change profile photo in Account tab">
            <img
              src={getSafeAvatarUrl(user?.avatar)}
              alt="avatar"
              className="ph-avatar"
              onError={(e) => { e.target.src = defaultAvatar; e.target.onError = null; }}
            />
            <div className="ph-avatar-overlay">
              <FaCamera className="ph-camera-icon" />
            </div>
            <span className="ph-online-dot" />
          </div>

          <div className="ph-info">
            <h2 className="ph-name">{user?.fullName || user?.name}</h2>
            <p className="ph-username">@{user?.username}</p>
            <p className="ph-email">{user?.email}</p>
            <div className="ph-level">
              <span className="ph-level-pill">Level {user?.level}</span>
              {user?.title && (
                <span className="ph-title-pill">✦ {user?.title}</span>
              )}
            </div>
          </div>
        </div>

        {/* Right — stats */}
        <div className="ph-stats">
          {stats.map((s, i) => (
            <div className="ph-stat" key={s.label}>
              <p className="ph-stat-value">{s.value ?? 0}</p>
              <p className="ph-stat-label">{s.label}</p>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}

export default ProfileHeader;
export { getSafeAvatarUrl };