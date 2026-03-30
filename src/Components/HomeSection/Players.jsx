import React from "react";
import PlayerCard from "./PlayerCard";
import "./Players.css";

function Players() {
  const playersData = [
    {
      name: "Virat Kohli",
      team: "RCB",
      runs: 650,
      wickets: 2,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD0KsnEnd1qUVhi7rmevIsRzz4SDFKFYMXhQ&s",
    },
    {
      name: "MS Dhoni",
      team: "CSK",
      runs: 420,
      wickets: 0,
      img: "https://wcric.in/wp-content/uploads/2025/03/photo-2.webp",
    },
    {
      name: "Jasprit Bumrah",
      team: "MI",
      runs: 50,
      wickets: 22,
      img: "https://i.pinimg.com/736x/21/c9/0e/21c90e382ca349c2c190dfbae1ba4af6.jpg",
    },
    {
      name: "Rohit Sharma",
      team: "MI",
      runs: 580,
      wickets: 1,
      img: "https://media.assettype.com/outlookindia/2024-07/5c1b801c-0287-4fb1-8d3b-9404d3d45699/rohit_sharma_with_t20_world_cup_trophy_X__BCCI.jpg?w=801&auto=format%2Ccompress&fit=max&format=webp&dpr=1.0",
    },
  ];

  return (
    <section className="players-section">
      <div className="container">
        <h2 className="section-title">Top Players</h2>

        <div className="players-grid">
          {playersData.map((player, index) => (
            <PlayerCard key={index} {...player} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Players;