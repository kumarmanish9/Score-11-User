import React, { useState } from "react";
import FeatureCard from "./FeatureCard";
import { FaChartLine, FaUsers, FaTrophy, FaVideo, FaUser } from "react-icons/fa";

function Features() {
  const featuresData = [
    {
      icon: <FaChartLine />,
      title: "Live Scoring",
      desc: "Real-time match updates with pro-level accuracy.",
      color: "#2563eb",
      bg: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
      accent: "rgba(37,99,235,0.12)",
      emoji: "📡",
    },
    {
      icon: <FaUsers />,
      title: "Team Management",
      desc: "Create, manage & track your cricket teams easily.",
      color: "#7c3aed",
      bg: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)",
      accent: "rgba(124,58,237,0.12)",
      emoji: "👥",
    },
    {
      icon: <FaTrophy />,
      title: "Tournaments",
      desc: "Organize leagues and tournaments like a pro.",
      color: "#d97706",
      bg: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
      accent: "rgba(217,119,6,0.12)",
      emoji: "🏆",
    },
    {
      icon: <FaUser />,
      title: "Player Profiles",
      desc: "Detailed stats & performance tracking per player.",
      color: "#0891b2",
      bg: "linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)",
      accent: "rgba(8,145,178,0.12)",
      emoji: "🏏",
    },
    {
      icon: <FaVideo />,
      title: "Highlights",
      desc: "Capture and relive the best match moments.",
      color: "#dc2626",
      bg: "linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)",
      accent: "rgba(220,38,38,0.12)",
      emoji: "🎥",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap');

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes iconPop {
          0%   { transform: scale(1) rotate(0deg); }
          40%  { transform: scale(1.18) rotate(-6deg); }
          70%  { transform: scale(0.95) rotate(4deg); }
          100% { transform: scale(1) rotate(0deg); }
        }

        .ft-section {
          background: #f8f9fc;
          padding: 80px 0 96px;
          font-family: 'Sora', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* subtle dot-grid bg */
        .ft-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, #d1d5db 1px, transparent 1px);
          background-size: 28px 28px;
          opacity: 0.28;
          pointer-events: none;
          z-index: 0;
        }

        .ft-container {
          max-width: 1160px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
          z-index: 1;
        }

        /* ── Header ── */
        .ft-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          margin-bottom: 56px;
          animation: fadeSlideUp 0.4s ease both;
        }
        .ft-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #f0fdf4;
          color: #16a34a;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          border-radius: 8px;
          padding: 4px 12px;
          border: 1px solid #bbf7d0;
        }
        .ft-eyebrow-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #22c55e;
        }
        .ft-title {
          font-size: 32px;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.8px;
          margin: 0;
          text-align: center;
        }
        .ft-title span {
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .ft-subtitle {
          font-size: 15px;
          color: #94a3b8;
          font-weight: 500;
          margin: 0;
          text-align: center;
          max-width: 420px;
        }
        .ft-header-line {
          width: 48px; height: 4px;
          border-radius: 2px;
          background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
          margin-top: 2px;
        }

        /* ── Grid ── */
        .ft-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }

        /* ── Card ── */
        .ft-card {
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
        .ft-card:nth-child(1) { animation-delay: 0.05s; }
        .ft-card:nth-child(2) { animation-delay: 0.10s; }
        .ft-card:nth-child(3) { animation-delay: 0.15s; }
        .ft-card:nth-child(4) { animation-delay: 0.20s; }
        .ft-card:nth-child(5) { animation-delay: 0.25s; }

        .ft-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.09);
        }

        /* top color strip on hover */
        .ft-card-strip {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          border-radius: 20px 20px 0 0;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .ft-card:hover .ft-card-strip { opacity: 1; }

        /* corner decorative circle */
        .ft-card-orb {
          position: absolute;
          width: 80px; height: 80px;
          border-radius: 50%;
          top: -24px; right: -24px;
          opacity: 0.55;
          transition: opacity 0.2s, transform 0.2s;
          pointer-events: none;
        }
        .ft-card:hover .ft-card-orb {
          opacity: 0.8;
          transform: scale(1.1);
        }

        /* icon */
        .ft-icon-wrap {
          width: 52px; height: 52px;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
          flex-shrink: 0;
          transition: transform 0.15s;
          position: relative;
          z-index: 1;
        }
        .ft-card:hover .ft-icon-wrap {
          animation: iconPop 0.45s ease both;
        }

        .ft-card-title {
          font-size: 15.5px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.2px;
          position: relative;
          z-index: 1;
        }
        .ft-card-desc {
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
          line-height: 1.6;
          margin: 0;
          position: relative;
          z-index: 1;
        }

        /* bottom arrow link */
        .ft-card-arrow {
          margin-top: auto;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.2px;
          opacity: 0;
          transform: translateX(-4px);
          transition: opacity 0.2s, transform 0.2s;
          position: relative;
          z-index: 1;
        }
        .ft-card:hover .ft-card-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        @media (max-width: 640px) {
          .ft-grid { grid-template-columns: 1fr 1fr; }
          .ft-title { font-size: 26px; }
        }
        @media (max-width: 400px) {
          .ft-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <section className="ft-section">
        <div className="ft-container">

          {/* HEADER */}
          <div className="ft-header">
            <span className="ft-eyebrow">
              <span className="ft-eyebrow-dot" />
              Platform
            </span>
            <h2 className="ft-title">
              Why <span>Score11?</span>
            </h2>
            <p className="ft-subtitle">
              Everything a cricket team needs — in one seamless platform.
            </p>
            <div className="ft-header-line" />
          </div>

          {/* GRID — passes same props to FeatureCard, but also renders inline styled cards */}
          <div className="ft-grid">
            {featuresData.map((item, index) => (
              <div
                className="ft-card"
                key={index}
                style={{ "--card-color": item.color }}
              >
                {/* top strip */}
                <div
                  className="ft-card-strip"
                  style={{ background: `linear-gradient(90deg, ${item.color}, ${item.color}99)` }}
                />

                {/* bg orb */}
                <div
                  className="ft-card-orb"
                  style={{ background: item.bg }}
                />

                {/* icon */}
                <div
                  className="ft-icon-wrap"
                  style={{ background: item.bg, color: item.color }}
                >
                  {item.icon}
                </div>

                <h3 className="ft-card-title">{item.title}</h3>
                <p className="ft-card-desc">{item.desc}</p>

                {/* hover arrow */}
                <span
                  className="ft-card-arrow"
                  style={{ color: item.color }}
                >
                  Learn more
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}

export default Features;