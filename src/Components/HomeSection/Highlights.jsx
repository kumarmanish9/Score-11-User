import React from "react";
import "./Highlights.css";

function Highlights() {
  const videos = [
    {
      title: "Match Winning Six 🔥",
      url: "https://www.youtube.com/embed/5PSNL1qE6VY",
    },
    {
      title: "Best Wickets Compilation 🎯",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
      title: "Top Catches 😲",
      url: "https://www.youtube.com/embed/ysz5S6PUM-U",
    },
  ];

  return (
    <section className="highlights-section">
      <div className="container">
        <h2 className="section-title">Match Highlights</h2>

        <div className="video-grid">
          {videos.map((video, index) => (
            <div className="video-card" key={index}>
              
              <div className="video-wrapper">
                <iframe
                  src={video.url}
                  title={video.title}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>

              <h3>{video.title}</h3>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Highlights;