import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Leaderboard.css";
import { getLeaderboardTop } from "../../Services/dashboardService";

function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getLeaderboardTop();
        if (!mounted) return;
        // normalize player entries
        const normalized = (data || []).map((p) => ({
          name: p.name || p.playerName || p.displayName || p.fullName || "Unknown",
          points: p.points || p.score || p.value || 0,
          avatar: p.avatar || p.image || null,
        }));
        setPlayers(normalized);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        if (mounted) setPlayers([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => (mounted = false);
  }, []);

  return (
    <section className="leaderboard-section">
      <div className="section-header">
        <h2>🏆 Leaderboard</h2>
        <Link to="/leaderboard" className="view-all">View All →</Link>
      </div>

      {loading ? (
        <div className="text-center py-3">Loading leaderboard...</div>
      ) : (
        <>
          <div className="top-players">
            {players.slice(0, 3).map((player, index) => (
              <div className={`top-card rank-${index + 1}`} key={index}>
                <div className="rank">#{index + 1}</div>
                <img src={player.avatar || `https://i.pravatar.cc/40?img=${index + 5}`} alt={player.name} />
                <h4>{player.name}</h4>
                <p>{player.points} pts</p>
              </div>
            ))}
          </div>

          <div className="leaderboard-list">
            {players.slice(3).map((player, index) => (
              <div className="leaderboard-item" key={index}>
                <span className="rank">#{index + 4}</span>
                <span className="name">{player.name}</span>
                <span className="points">{player.points} pts</span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default Leaderboard;