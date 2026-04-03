import React from "react";
import { getPlayers } from "../../Services/playerService";
import PlayerCard from "./PlayerCard";
import "./Players.css";

function Players({ players = [] }) {
  const [topPlayers, setTopPlayers] = React.useState(players.slice(0, 8));
  const [loading, setLoading] = React.useState(!players.length);

  React.useEffect(() => {
    if (!players.length) {
      fetchPlayers();
    } else {
      setTopPlayers(players.slice(0, 8));
      setLoading(false);
    }
  }, [players]);

  const fetchPlayers = async () => {
    try {
      const data = await getPlayers();
      setTopPlayers(data.slice(0, 8));
    } catch (err) {
      console.error('Players fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="players-section">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
              <span className="visually-hidden">Loading top players...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="players-section py-5 bg-light">
      <div className="container">
        <div className="text-center mb-5 fade-in-up">
          <h2 className="section-title mb-3">Top Players</h2>
          <p className="lead text-muted">Best performers this season</p>
        </div>

        <div className="row g-4">
          {topPlayers.map((player, index) => (
            <div className="col-lg-3 col-md-6" key={player._id || index}>
              <PlayerCard {...player} rank={index + 1} />
            </div>
          ))}
        </div>

        <div className="text-center mt-5">
          <a href="/players" className="btn btn-primary btn-lg">
            View All Players →
          </a>
        </div>
      </div>
    </section>
  );
}

export default Players;
