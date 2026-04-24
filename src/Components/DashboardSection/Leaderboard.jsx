import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLeaderboardTop } from "../../Services/dashboardService";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  .lb-section {
    background: #ffffff;
    border-radius: 24px;
    padding: 28px;
    box-shadow: 0 2px 24px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04);
    font-family: 'DM Sans', sans-serif;
    max-width: 480px;
  }

  .lb-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
  }

  .lb-header h2 {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 800;
    color: #111;
    margin: 0;
    letter-spacing: -0.3px;
  }

  .lb-view-all {
    font-size: 13px;
    font-weight: 500;
    color: #888;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: color 0.2s;
  }

  .lb-view-all:hover {
    color: #111;
  }

  /* --- Top 3 Podium --- */
  .lb-podium {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 10px;
    margin-bottom: 24px;
  }

  .lb-pod-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 20px;
    padding: 18px 10px 16px;
    position: relative;
    transition: transform 0.2s ease;
    cursor: default;
  }

  .lb-pod-card:hover {
    transform: translateY(-3px);
  }

  /* Rank 1 - center, tallest */
  .lb-pod-card.rank-1 {
    background: linear-gradient(160deg, #fff9ec 0%, #fff3d0 100%);
    border: 1.5px solid #f5d97a;
    order: 2;
    padding-top: 24px;
  }

  /* Rank 2 - left */
  .lb-pod-card.rank-2 {
    background: #f7f7f7;
    border: 1.5px solid #e8e8e8;
    order: 1;
  }

  /* Rank 3 - right */
  .lb-pod-card.rank-3 {
    background: linear-gradient(160deg, #fff8f2 0%, #ffeee0 100%);
    border: 1.5px solid #f0c8a4;
    order: 3;
  }

  .lb-pod-badge {
    position: absolute;
    top: -12px;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .rank-1 .lb-pod-badge { background: #f5c500; color: #fff; font-size: 14px; }
  .rank-2 .lb-pod-badge { background: #a0a8b0; color: #fff; }
  .rank-3 .lb-pod-badge { background: #e0916a; color: #fff; }

  .lb-pod-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 10px;
    border: 2px solid rgba(255,255,255,0.9);
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }

  .rank-1 .lb-pod-avatar {
    width: 56px;
    height: 56px;
  }

  .lb-pod-name {
    font-size: 13px;
    font-weight: 600;
    color: #222;
    margin: 0 0 4px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 90px;
  }

  .lb-pod-pts {
    font-size: 12px;
    font-weight: 500;
    color: #888;
    margin: 0;
  }

  .rank-1 .lb-pod-pts { color: #c89a00; font-weight: 600; }

  /* --- List rows --- */
  .lb-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .lb-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border-radius: 14px;
    background: #fafafa;
    border: 1px solid #f0f0f0;
    transition: background 0.15s, transform 0.15s;
    cursor: default;
  }

  .lb-row:hover {
    background: #f4f4f4;
    transform: translateX(3px);
  }

  .lb-row-rank {
    font-size: 12px;
    font-weight: 700;
    color: #bbb;
    width: 22px;
    text-align: center;
    flex-shrink: 0;
  }

  .lb-row-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }

  .lb-row-name {
    flex: 1;
    font-size: 14px;
    font-weight: 500;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .lb-row-pts {
    font-size: 13px;
    font-weight: 600;
    color: #aaa;
    white-space: nowrap;
  }

  /* Loading skeleton */
  .lb-skeleton {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .lb-skel-row {
    height: 52px;
    border-radius: 14px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
  }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .lb-empty {
    text-align: center;
    padding: 32px 0;
    color: #bbb;
    font-size: 14px;
  }
`;

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

  const top3 = players.slice(0, 3);
  const rest = players.slice(3);

  return (
    <>
      <style>{styles}</style>
      <section className="lb-section">
        {/* Header */}
        <div className="lb-header">
          <h2>🏆 Leaderboard</h2>
          <Link to="/leaderboard" className="lb-view-all">
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="lb-skeleton">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="lb-skel-row" style={{ opacity: 1 - i * 0.12 }} />
            ))}
          </div>
        ) : players.length === 0 ? (
          <div className="lb-empty">No players yet</div>
        ) : (
          <>
            {/* Top 3 Podium */}
            {top3.length > 0 && (
              <div className="lb-podium">
                {top3.map((player, index) => (
                  <div className={`lb-pod-card rank-${index + 1}`} key={index}>
                    <div className="lb-pod-badge">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                    </div>
                    <img
                      src={player.avatar || `https://i.pravatar.cc/80?img=${index + 5}`}
                      alt={player.name}
                      className="lb-pod-avatar"
                    />
                    <p className="lb-pod-name">{player.name}</p>
                    <p className="lb-pod-pts">{player.points} pts</p>
                  </div>
                ))}
              </div>
            )}

            {/* Rows 4+ */}
            {rest.length > 0 && (
              <div className="lb-list">
                {rest.map((player, index) => (
                  <div className="lb-row" key={index}>
                    <span className="lb-row-rank">#{index + 4}</span>
                    <img
                      src={player.avatar || `https://i.pravatar.cc/40?img=${index + 8}`}
                      alt={player.name}
                      className="lb-row-avatar"
                    />
                    <span className="lb-row-name">{player.name}</span>
                    <span className="lb-row-pts">{player.points} pts</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}

export default Leaderboard;