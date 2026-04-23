import React, { useState } from "react";

function Highlights() {
  const videos = [
    {
      title: "Match Winning Six 🔥",
      url: "https://www.youtube.com/embed/5PSNL1qE6VY",
      tag: "Batting",
    },
    {
      title: "Best Wickets Compilation 🎯",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      tag: "Bowling",
    },
    {
      title: "Top Catches 😲",
      url: "https://www.youtube.com/embed/ysz5S6PUM-U",
      tag: "Fielding",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .hl-section {
          background: #f8f9fc;
          padding: 72px 0 88px;
          font-family: 'Sora', sans-serif;
        }
        .hl-container {
          max-width: 1160px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ── Header ── */
        .hl-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          margin-bottom: 48px;
          animation: fadeSlideUp 0.4s ease both;
        }
        .hl-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #fef2f2;
          color: #dc2626;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          border-radius: 8px;
          padding: 4px 12px;
          border: 1px solid #fecaca;
        }
        .hl-eyebrow-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #ef4444;
        }
        .hl-title {
          font-size: 32px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.8px;
          margin: 0;
          text-align: center;
        }
        .hl-title span {
          background: linear-gradient(135deg, #ef4444 0%, #f97316 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hl-subtitle {
          font-size: 14.5px;
          color: #94a3b8;
          font-weight: 500;
          margin: 0;
        }
        .hl-header-line {
          width: 48px; height: 4px;
          border-radius: 2px;
          background: linear-gradient(90deg, #ef4444 0%, #f97316 100%);
          margin-top: 2px;
        }

        /* ── Grid ── */
        .hl-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        /* ── Video card ── */
        .hl-card {
          background: #ffffff;
          border: 1.5px solid #e8edf5;
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
          animation: fadeSlideUp 0.4s ease both;
          cursor: pointer;
        }
        .hl-card:nth-child(1) { animation-delay: 0.05s; }
        .hl-card:nth-child(2) { animation-delay: 0.12s; }
        .hl-card:nth-child(3) { animation-delay: 0.19s; }
        .hl-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.10);
          border-color: #fecaca;
        }

        /* video wrapper — 16:9 */
        .hl-video-wrap {
          position: relative;
          width: 100%;
          padding-top: 56.25%;
          background: #0f172a;
          overflow: hidden;
        }
        .hl-video-wrap iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: none;
          display: block;
        }
        /* play overlay — fades on hover */
        .hl-play-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(15,23,42,0.32);
          transition: opacity 0.2s;
          pointer-events: none;
        }
        .hl-card:hover .hl-play-overlay { opacity: 0; }
        .hl-play-icon {
          width: 52px; height: 52px;
          border-radius: 50%;
          background: rgba(255,255,255,0.92);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 20px rgba(0,0,0,0.25);
        }

        /* card body */
        .hl-card-body {
          padding: 18px 20px 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
        }
        .hl-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
        }
        .hl-card-title {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
          line-height: 1.3;
          flex: 1;
        }
        .hl-tag {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
          border-radius: 6px;
          padding: 3px 9px;
          flex-shrink: 0;
          text-transform: uppercase;
        }
        .hl-tag-batting  { background: #fff7ed; color: #ea580c; border: 1px solid #fed7aa; }
        .hl-tag-bowling  { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
        .hl-tag-fielding { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }

        .hl-card-divider {
          height: 1px;
          background: #f1f5f9;
        }
        .hl-watch-row {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #ef4444;
          font-size: 12.5px;
          font-weight: 700;
          letter-spacing: 0.2px;
        }
      `}</style>

      <section className="hl-section">
        <div className="hl-container">

          {/* HEADER */}
          <div className="hl-header">
            <span className="hl-eyebrow">
              <span className="hl-eyebrow-dot" />
              Rewind
            </span>
            <h2 className="hl-title">
              Match <span>Highlights</span>
            </h2>
            <p className="hl-subtitle">Best moments from recent games</p>
            <div className="hl-header-line" />
          </div>

          {/* VIDEO GRID */}
          <div className="hl-grid">
            {videos.map((video, index) => {
              const tagClass = `hl-tag hl-tag-${video.tag.toLowerCase()}`;
              return (
                <div className="hl-card" key={index}>

                  {/* VIDEO */}
                  <div className="hl-video-wrap">
                    <iframe
                      src={video.url}
                      title={video.title}
                      frameBorder="0"
                      allowFullScreen
                    />
                    {/* Play overlay */}
                    <div className="hl-play-overlay">
                      <div className="hl-play-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#ef4444">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* BODY */}
                  <div className="hl-card-body">
                    <div className="hl-card-top">
                      <h3 className="hl-card-title">{video.title}</h3>
                      <span className={tagClass}>{video.tag}</span>
                    </div>
                    <div className="hl-card-divider" />
                    <div className="hl-watch-row">
                      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                      Watch Highlight
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>
    </>
  );
}

export default Highlights;