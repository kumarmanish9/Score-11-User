import React from "react";
import { getPlayers } from "../../Services/playerService";
import PlayerCard from "./PlayerCard";
import "./Players.css";

function Players({ players = [] }) {
  const [topPlayers, setTopPlayers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (players.length) {
      setTopPlayers(players.slice(0, 8));
      setLoading(false);
    } else {
      fetchPlayers();
    }
  }, [players]);

  const fetchPlayers = async () => {
    try {
      const data = await getPlayers();
      console.log("Players API:", data);

      // adjust if API returns { data: [] }
      const playersData = data.data || data;

      setTopPlayers(playersData.slice(0, 8));
    } catch (err) {
      console.error("Players fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="players-section py-5">
      <div className="container">

        {/* HEADER */}
        <div className="text-center mb-5">
          <h2 className="section-title">Top Players</h2>
          <p className="section-subtitle">Best performers this season</p>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
          </div>
        ) : (
          <>
            {/* GRID */}
            <div className="players-grid">
              {topPlayers.map((player, index) => (
                <PlayerCard
                  key={player._id || index}
                  {...player}
                  rank={index + 1}
                />
              ))}
            </div>

            {/* BUTTON */}
            <div className="text-center mt-5">
              <a href="/players" className="view-btn">
                View All Players →
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default Players;