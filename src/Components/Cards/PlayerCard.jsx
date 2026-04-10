import React, { useEffect, useState } from "react";
import "./PlayerCard.css";
import { getPlayerById } from "../../Services/playerService";

function PlayerCard({
  player,
  _id,
  compact = false,
  rank,
  onClick,
}) {
  const [playerData, setPlayerData] = useState(player || null);

  // ✅ Fetch only if player not provided
  useEffect(() => {
    let mounted = true;

    if (!player && _id) {
      getPlayerById(_id)
        .then((res) => {
          if (!mounted) return;
          const data = res.data || res;
          setPlayerData(data);
        })
        .catch(() => {});
    }

    return () => (mounted = false);
  }, [_id, player]);

  // ✅ Safe Data Extraction
  const name =
    playerData?.name ||
    playerData?.fullName ||
    playerData?.playerName ||
    "Player";

  const team =
    playerData?.team?.shortName ||
    playerData?.team?.name ||
    playerData?.team ||
    "Team";

  const img = playerData?.img || playerData?.image;

  const runs = playerData?.runs || 0;
  const wickets = playerData?.wickets || 0;

  return (
    <div
      className={`player-card ${compact ? "compact" : ""}`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      {/* 🔢 Rank */}
      {rank && <div className="rank-badge">#{rank}</div>}

      {/* 🖼 Image */}
      <div className="player-img">
        {img ? (
          <img
            src={img}
            alt={name}
            onError={(e) => {
              e.target.src = "/default-player.png";
            }}
          />
        ) : (
          <div className="avatar-fallback">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* 📄 Info */}
      <div className="player-info">
        <h4 className="player-name">{name}</h4>
        <p className="team">{team}</p>

        {/* 📊 Stats */}
        {!compact && (
          <div className="stats">
            <div>
              <span>Runs</span>
              <strong>{runs}</strong>
            </div>
            <div>
              <span>Wickets</span>
              <strong>{wickets}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayerCard;