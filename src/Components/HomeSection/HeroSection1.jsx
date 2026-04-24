import React, { useEffect, useRef } from "react";
import "./HeroSection1.css";
import lottie from "lottie-web";
import cricketAnim from "../../assets/Styles/animations/cricketShot.json";

function HeroSection() {
  const animationRef = useRef(null);

  useEffect(() => {
    lottie.loadAnimation({
      container: animationRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: cricketAnim,
    });
  }, []);

  return (
    <section className="hero-section">
      <div className="container">
        <div className="row align-items-center">

          {/* LEFT */}
          <div className="col-lg-6 hero-content">
            <h1 className="hero-title">
              Score Your Cricket <br />
              Like a Pro 🏏
            </h1>
          </div>

          {/* RIGHT */}
          <div className="col-lg-6 hero-animation">
            <div ref={animationRef} style={{ height: "400px" }} />
          </div>

        </div>
      </section>
    </>
  );
}

export default HeroSection;