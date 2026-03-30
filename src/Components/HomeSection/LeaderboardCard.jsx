import React from "react";
import "./Leaderboard.css";
import { motion } from "framer-motion";

function LeaderboardCard({ title, data }) {
  return (
    <motion.div
      className="leaderboard-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h3>{title}</h3>

      <ul>
        {data.map((player, index) => {
          let rankClass = "";
          if (index === 0) rankClass = "gold";
          else if (index === 1) rankClass = "silver";
          else if (index === 2) rankClass = "bronze";

          return (
            <motion.li
              key={index}
              className={`leader-item ${rankClass}`}
              whileHover={{ scale: 1.05 }}
            >
              <span className="rank">#{index + 1}</span>

              <div className="player-info">
                <span className="name">{player.name}</span>
              </div>

              <span className="score">{player.score}</span>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}

export default LeaderboardCard;