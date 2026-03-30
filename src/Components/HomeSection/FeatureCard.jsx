import React from "react";
import "./Features.css";

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="feature-card">
      <div className="icon-wrapper">
        {icon}
      </div>

      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

export default FeatureCard;