import React, { useState } from "react";

function FeatureCard({ icon, title, desc, color, bg }) {
  const [hovered, setHovered] = useState(false);

  // fallback defaults if used standalone
  const cardColor = color || "#2563eb";
  const cardBg = bg || "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');

        @keyframes iconPop {
          0%   { transform: scale(1) rotate(0deg); }
          40%  { transform: scale(1.18) rotate(-6deg); }
          70%  { transform: scale(0.95) rotate(4deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .fc-card {
          font-family: 'Sora', sans-serif;
          background: #ffffff;
          border: 1.5px solid #e8edf5;
          border-radius: 20px;
          padding: 28px 22px 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          cursor: default;
          position: relative;
          overflow: hidden;
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
          animation: fadeSlideUp 0.4s ease both;
        }
        .fc-card.hovered {
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.09);
        }

        /* top color strip */
        .fc-strip {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          border-radius: 20px 20px 0 0;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .fc-card.hovered .fc-strip { opacity: 1; }

        /* corner orb */
        .fc-orb {
          position: absolute;
          width: 80px; height: 80px;
          border-radius: 50%;
          top: -24px; right: -24px;
          opacity: 0.5;
          pointer-events: none;
          transition: opacity 0.2s, transform 0.2s;
        }
        .fc-card.hovered .fc-orb {
          opacity: 0.85;
          transform: scale(1.12);
        }

        /* icon */
        .fc-icon-wrap {
          width: 52px; height: 52px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
          transition: transform 0.15s;
        }
        .fc-card.hovered .fc-icon-wrap {
          animation: iconPop 0.45s ease both;
        }

        .fc-title {
          font-size: 15.5px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.2px;
          position: relative;
          z-index: 1;
        }
        .fc-desc {
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
          line-height: 1.65;
          margin: 0;
          position: relative;
          z-index: 1;
        }

        /* hover arrow */
        .fc-arrow {
          margin-top: 2px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.2px;
          opacity: 0;
          transform: translateX(-6px);
          transition: opacity 0.2s, transform 0.2s;
          position: relative;
          z-index: 1;
        }
        .fc-card.hovered .fc-arrow {
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>

      <div
        className={`fc-card${hovered ? " hovered" : ""}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* top strip */}
        <div
          className="fc-strip"
          style={{ background: `linear-gradient(90deg, ${cardColor}, ${cardColor}88)` }}
        />

        {/* bg orb */}
        <div className="fc-orb" style={{ background: cardBg }} />

        {/* icon */}
        <div
          className="fc-icon-wrap"
          style={{ background: cardBg, color: cardColor }}
        >
          {icon}
        </div>

        <h3 className="fc-title">{title}</h3>
        <p className="fc-desc">{desc}</p>

        {/* hover reveal arrow */}
        <span className="fc-arrow" style={{ color: cardColor }}>
          Learn more
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </>
  );
}

export default FeatureCard;