import React, { useEffect, useState } from "react";
import { getPlayerById } from "../../Services/playerService";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  /* ── Full card ── */
  .pc-card {
    background: #fff;
    border-radius: 18px;
    border: 1.5px solid #efefef;
    padding: 18px 16px 14px;
    font-family: 'DM Sans', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    position: relative;
    transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  }

  .pc-card.clickable { cursor: pointer; }

  .pc-card.clickable:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.10);
    border-color: #ddd;
  }

  /* ── Compact card ── */
  .pc-card.compact {
    flex-direction: row;
    align-items: center;
    padding: 10px 12px;
    gap: 10px;
    border-radius: 14px;
  }

  /* ── Rank badge ── */
  .pc-rank {
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 10px;
    font-weight: 700;
    color: #bbb;
    letter-spacing: 0.03em;
    line-height: 1;
  }

  .pc-card.compact .pc-rank {
    position: static;
    font-size: 10px;
    color: #ccc;
    min-width: 22px;
    text-align: center;
  }

  /* ── Avatar ── */
  .pc-avatar {
    width: 58px;
    height: 58px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    border: 2px solid #f0f0f0;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pc-card.compact .pc-avatar {
    width: 36px;
    height: 36px;
  }

  .pc-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .pc-avatar-fallback {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 800;
    color: #ccc;
    line-height: 1;
    user-select: none;
  }

  .pc-card.compact .pc-avatar-fallback {
    font-size: 14px;
  }

  /* ── Info ── */
  .pc-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    width: 100%;
  }

  .pc-card.compact .pc-info {
    align-items: flex-start;
    flex: 1;
    min-width: 0;
  }

  .pc-name {
    font-family: 'Playfair Display', serif;
    font-size: 14px;
    font-weight: 700;
    color: #111;
    margin: 0;
    text-align: center;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }

  .pc-card.compact .pc-name {
    font-size: 13px;
    text-align: left;
  }

  .pc-team {
    font-size: 11px;
    font-weight: 500;
    color: #aaa;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }

  .pc-card.compact .pc-team {
    font-size: 11px;
  }

  /* ── Stats (full only) ── */
  .pc-stats {
    display: flex;
    gap: 12px;
    margin-top: 6px;
    width: 100%;
    justify-content: center;
  }

  .pc-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    flex: 1;
    background: #f8f8f8;
    border-radius: 10px;
    padding: 8px 6px 6px;
    border: 1px solid #f0f0f0;
  }

  .pc-stat span {
    font-size: 10px;
    font-weight: 500;
    color: #bbb;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .pc-stat strong {
    font-size: 16px;
    font-weight: 800;
    color: #222;
    font-family: 'Playfair Display', serif;
    line-height: 1;
  }

  /* ── Loading skeleton ── */
  .pc-skeleton {
    background: linear-gradient(90deg, #f5f5f5 25%, #ececec 50%, #f5f5f5 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 18px;
    height: 130px;
    width: 100%;
  }

  .pc-card.compact .pc-skeleton {
    height: 56px;
    border-radius: 14px;
  }

  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

function PlayerCard({ player, _id, compact = false, rank, onClick }) {
  const [playerData, setPlayerData] = useState(player || null);
  const [fetching, setFetching] = useState(!player && !!_id);

  useEffect(() => {
    let mounted = true;
    if (!player && _id) {
      setFetching(true);
      getPlayerById(_id)
        .then((res) => {
          if (!mounted) return;
          setPlayerData(res.data || res);
        })
        .catch(() => {})
        .finally(() => { if (mounted) setFetching(false); });
    }
    return () => (mounted = false);
  }, [_id, player]);

  const name     = playerData?.name || playerData?.fullName || playerData?.playerName || "Player";
  const team     = playerData?.team?.shortName || playerData?.team?.name || playerData?.team || "Team";
  const img      = playerData?.img || playerData?.image;
  const runs     = playerData?.runs || 0;
  const wickets  = playerData?.wickets || 0;

  if (fetching) {
    return (
      <>
        <style>{styles}</style>
        <div className={`pc-card ${compact ? "compact" : ""}`}>
          <div className="pc-skeleton" />
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div
        className={`pc-card ${compact ? "compact" : ""} ${onClick ? "clickable" : ""}`}
        onClick={onClick}
      >
        {rank && <span className="pc-rank">#{rank}</span>}

        {/* Avatar */}
        <div className="pc-avatar">
          {img ? (
            <img
              src={img}
              alt={name}
              onError={(e) => { e.target.src = "/default-player.png"; }}
            />
          ) : (
            <span className="pc-avatar-fallback">
              {name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="pc-info">
          <p className="pc-name">{name}</p>
          <p className="pc-team">{team}</p>

          {!compact && (
            <div className="pc-stats">
              <div className="pc-stat">
                <span>Runs</span>
                <strong>{runs}</strong>
              </div>
              <div className="pc-stat">
                <span>Wickets</span>
                <strong>{wickets}</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default PlayerCard;