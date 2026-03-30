import React from "react";
import "./HeroSection1.css";
import heroImg from "../../assets/Styles/Section1.png"; // use any cricket image

function HeroSection() {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="row align-items-center">

          {/* LEFT CONTENT */}
          <div className="col-lg-6 col-md-12 text-center text-lg-start">
            <h1 className="hero-title">
              Score Your Cricket <br /> Like a Pro 🏏
            </h1>

            <p className="hero-subtitle">
              Live scoring, player stats, tournaments & everything in one place.
            </p>

            <div className="hero-buttons">
              <button className="btn btn-success me-3">
                Start Scoring
              </button>

              <button className="btn btn-outline-light">
                Explore Matches
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="col-lg-6 col-md-12 text-center mt-4 mt-lg-0">
            {/* <img src={heroImg} alt="hero" className="hero-img" /> */}
          </div>

        </div>
      </div>
    </section>
  );
}

export default HeroSection;