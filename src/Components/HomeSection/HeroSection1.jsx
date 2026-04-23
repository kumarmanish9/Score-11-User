import React, { useState } from "react";
import heroImg from "../../assets/Styles/Section1.png";

function HeroSection() {
  const [hoveredBtn, setHoveredBtn] = useState(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap');

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatImg {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes bgOrb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(30px, -20px) scale(1.08); }
        }
        @keyframes bgOrb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(-20px, 18px) scale(1.05); }
        }
        @keyframes pulseDot {
          0%, 100% { box-shadow: 0 0 0 0 rgba(37,99,235,0.4); }
          50%       { box-shadow: 0 0 0 8px rgba(37,99,235,0); }
        }

        .hero-wrap {
          font-family: 'Sora', sans-serif;
          background: #ffffff;
          min-height: 100vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          padding: 80px 0 64px;
        }

        /* subtle background orbs */
        .hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(72px);
          pointer-events: none;
          z-index: 0;
        }
        .hero-orb-1 {
          width: 480px; height: 480px;
          background: radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%);
          top: -80px; left: -120px;
          animation: bgOrb1 8s ease-in-out infinite;
        }
        .hero-orb-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%);
          bottom: -60px; right: -80px;
          animation: bgOrb2 10s ease-in-out infinite;
        }
        .hero-orb-3 {
          width: 220px; height: 220px;
          background: radial-gradient(circle, rgba(234,179,8,0.07) 0%, transparent 70%);
          top: 40%; left: 40%;
          animation: bgOrb1 12s ease-in-out infinite reverse;
        }

        .hero-inner {
          max-width: 1160px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 48px;
          position: relative;
          z-index: 1;
          width: 100%;
        }

        /* ── LEFT ── */
        .hero-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 28px;
          animation: fadeSlideUp 0.5s ease both;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #eff6ff;
          border: 1.5px solid #bfdbfe;
          color: #1d4ed8;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          border-radius: 999px;
          padding: 6px 16px;
        }
        .hero-badge-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #2563eb;
          animation: pulseDot 2s infinite;
        }

        .hero-heading {
          font-size: clamp(36px, 5vw, 58px);
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -1.5px;
          line-height: 1.08;
          margin: 0;
        }
        .hero-heading .accent {
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-heading .accent-green {
          background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 17px;
          color: #64748b;
          font-weight: 500;
          line-height: 1.65;
          margin: 0;
          max-width: 460px;
        }

        /* stat chips */
        .hero-stats {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }
        .hero-stat {
          display: flex;
          flex-direction: column;
          background: #f8f9fc;
          border: 1.5px solid #e8edf5;
          border-radius: 14px;
          padding: 12px 18px;
          min-width: 90px;
        }
        .hero-stat-num {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.5px;
          line-height: 1;
        }
        .hero-stat-label {
          font-size: 11.5px;
          color: #94a3b8;
          font-weight: 600;
          margin-top: 3px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* buttons */
        .hero-btns {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }
        .hero-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 14px 30px;
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          color: #fff;
          font-family: 'Sora', sans-serif;
          font-size: 14.5px;
          font-weight: 700;
          border-radius: 13px;
          border: none;
          cursor: pointer;
          letter-spacing: 0.2px;
          transition: transform 0.18s, box-shadow 0.18s;
          box-shadow: 0 4px 20px rgba(37,99,235,0.28);
          text-decoration: none;
        }
        .hero-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(37,99,235,0.38);
        }
        .hero-btn-primary:active { transform: translateY(0); }

        .hero-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 13px 28px;
          background: #ffffff;
          color: #0f172a;
          font-family: 'Sora', sans-serif;
          font-size: 14.5px;
          font-weight: 700;
          border-radius: 13px;
          border: 1.5px solid #e2e8f0;
          cursor: pointer;
          letter-spacing: 0.2px;
          transition: border-color 0.18s, transform 0.18s, box-shadow 0.18s;
          text-decoration: none;
        }
        .hero-btn-secondary:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 16px rgba(0,0,0,0.07);
          transform: translateY(-2px);
        }

        /* ── RIGHT ── */
        .hero-right {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          animation: fadeSlideUp 0.55s ease 0.12s both;
        }

        .hero-img-frame {
          position: relative;
          width: 100%;
          max-width: 480px;
        }

        /* decorative ring */
        .hero-img-ring {
          position: absolute;
          inset: -20px;
          border-radius: 50%;
          border: 2px dashed #e2e8f0;
          animation: floatImg 5s ease-in-out infinite;
          pointer-events: none;
        }

        .hero-img-card {
          position: relative;
          background: linear-gradient(135deg, #f0f4ff 0%, #f5f0ff 50%, #fff7ed 100%);
          border-radius: 28px;
          border: 1.5px solid #e8edf5;
          overflow: hidden;
          aspect-ratio: 1 / 1;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 20px 60px rgba(37,99,235,0.10),
            0 4px 16px rgba(0,0,0,0.06);
          animation: floatImg 5s ease-in-out infinite;
        }

        .hero-img-card img {
          width: 88%;
          height: 88%;
          object-fit: contain;
          display: block;
          filter: drop-shadow(0 8px 24px rgba(37,99,235,0.15));
        }

        /* placeholder if img missing */
        .hero-img-placeholder {
          font-size: 96px;
          line-height: 1;
          filter: drop-shadow(0 6px 20px rgba(0,0,0,0.12));
        }

        /* floating chips on image */
        .hero-chip {
          position: absolute;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #ffffff;
          border: 1.5px solid #e8edf5;
          border-radius: 12px;
          padding: 8px 14px;
          font-size: 12.5px;
          font-weight: 700;
          color: #0f172a;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
          white-space: nowrap;
        }
        .hero-chip-1 { top: 16px; left: -20px; animation: floatImg 4s ease-in-out infinite; }
        .hero-chip-2 { bottom: 24px; right: -16px; animation: floatImg 5s ease-in-out 1s infinite; }
        .hero-chip-3 { top: 50%; left: -28px; transform: translateY(-50%); animation: floatImg 6s ease-in-out 0.5s infinite; }
        .hero-chip-icon {
          width: 24px; height: 24px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px;
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .hero-inner {
            flex-direction: column;
            text-align: center;
          }
          .hero-left {
            align-items: center;
          }
          .hero-subtitle { text-align: center; }
          .hero-right { width: 100%; max-width: 360px; }
          .hero-chip-1, .hero-chip-2, .hero-chip-3 { display: none; }
        }
      `}</style>

      <section className="hero-wrap">
        {/* BG orbs */}
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />

        <div className="hero-inner">

          {/* ── LEFT ── */}
          <div className="hero-left">

            <span className="hero-badge">
              <span className="hero-badge-dot" />
              Live Cricket Platform
            </span>

            <h1 className="hero-heading">
              Score Your Cricket <br />
              <span className="accent">Like a </span>
              <span className="accent-green">Pro 🏏</span>
            </h1>

            <p className="hero-subtitle">
              Live scoring, player stats, tournaments &amp; everything in one place. Track every ball, every wicket, every moment.
            </p>

            {/* Stats */}
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-num">500+</span>
                <span className="hero-stat-label">Matches</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-num">1.2k</span>
                <span className="hero-stat-label">Players</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-num">Live</span>
                <span className="hero-stat-label">Scoring</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="hero-btns">
              <button className="hero-btn-primary">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="5 3 19 12 5 21 5 3" fill="white" stroke="none"/>
                </svg>
                Start Scoring
              </button>
              <button className="hero-btn-secondary">
                Explore Matches
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>

          </div>

          {/* ── RIGHT ── */}
          <div className="hero-right">
            <div className="hero-img-frame">

              {/* Floating chips */}
              <div className="hero-chip hero-chip-1">
                <span className="hero-chip-icon" style={{ background: "#fef2f2" }}>🔴</span>
                Live Now
              </div>
              <div className="hero-chip hero-chip-2">
                <span className="hero-chip-icon" style={{ background: "#f0fdf4" }}>🏆</span>
                Tournament Mode
              </div>
              <div className="hero-chip hero-chip-3">
                <span className="hero-chip-icon" style={{ background: "#eff6ff" }}>📊</span>
                Player Stats
              </div>

              {/* Image card */}
              <div className="hero-img-card">
                <img
                  src={heroImg}
                  alt="Cricket scoring hero"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
                <span className="hero-img-placeholder" style={{ display: "none" }}>🏏</span>
              </div>

            </div>
          </div>

        </div>
      </section>
    </>
  );
}

export default HeroSection;