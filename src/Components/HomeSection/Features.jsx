import React from "react";
import FeatureCard from "./FeatureCard";
import "./Features.css";
import { FaChartLine, FaUsers, FaTrophy, FaVideo, FaUser } from "react-icons/fa";

function Features() {
  const featuresData = [
    {
      icon: <FaChartLine />,
      title: "Live Scoring",
      desc: "Real-time match updates with pro-level accuracy.",
    },
    {
      icon: <FaUsers />,
      title: "Team Management",
      desc: "Create, manage & track your cricket teams easily.",
    },
    {
      icon: <FaTrophy />,
      title: "Tournaments",
      desc: "Organize leagues and tournaments like a pro.",
    },
    {
      icon: <FaUser />,
      title: "Player Profiles",
      desc: "Detailed stats & performance tracking.",
    },
    {
      icon: <FaVideo />,
      title: "Highlights",
      desc: "Capture and relive match moments.",
    },
  ];

  return (
    <section className="features-section">
      <div className="container">
        <h2 className="section-title">Why Score11?</h2>

        <div className="features-grid">
          {featuresData.map((item, index) => (
            <FeatureCard
              key={index}
              icon={item.icon}
              title={item.title}
              desc={item.desc}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;