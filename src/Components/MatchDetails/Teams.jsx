import React, { useEffect, useState } from "react";

// ─── Google Fonts ───────────────────────────────────────────────────────────
function useGoogleFonts() {
  useEffect(() => {
    const id = "teams-gfonts";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Outfit:wght@300;400;500;600&display=swap";
      document.head.appendChild(link);
    }
  }, []);
}

// ─── Role Config ────────────────────────────────────────────────────────────
const ROLE_STYLES = {
  "Batsman":        { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  "Batter":         { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  "Bowler":         { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
  "All-Rounder":    { bg: "#fdf4ff", color: "#7e22ce", border: "#e9d5ff" },
  "All Rounder":    { bg: "#fdf4ff", color: "#7e22ce", border: "#e9d5ff" },
  "Wicket-Keeper":  { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
  "Wicket Keeper":  { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
  "WK-Batsman":     { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
  "default":        { bg: "#f8fafc", color: "#475569", border: "#e2e8f0" },
};

function getRoleStyle(role) {
  return ROLE_STYLES[role] || ROLE_STYLES["default"];
}

// ─── Skeleton Row ───────────────────────────────────────────────────────────
function SkeletonRow({ i }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 20px",
        borderBottom: "1px solid #f1f5f9",
        opacity: 1 - i * 0.06,
      }}
    >
      <div
        style={{
          width: "32px", height: "32px", borderRadius: "50%",
          background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.4s infinite",
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
        <div
          style={{
            height: "12px", borderRadius: "6px", width: `${55 + (i % 4) * 10}%`,
            background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.4s infinite",
          }}
        />
        <div
          style={{
            height: "10px", borderRadius: "6px", width: "30%",
            background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.4s infinite",
          }}
        />
      </div>
    </div>
  );
}

// ─── Player Row ─────────────────────────────────────────────────────────────
function PlayerRow({ player, index, accentColor, getPlayerName, getPlayerRole }) {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const name  = getPlayerName(player);
  const role  = getPlayerRole(player);
  const roleStyle = getRoleStyle(role);

  // Captain / Vice-Captain detection
  const isCaptain    = typeof player === "object" && (player?.isCaptain    || player?.captain);
  const isViceCaptain = typeof player === "object" && (player?.isViceCaptain || player?.viceCaptain);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 35);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "11px 20px",
        borderBottom: "1px solid #f8fafc",
        background: hovered ? "#f8faff" : "transparent",
        transition: "background 0.15s, opacity 0.3s, transform 0.3s",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-10px)",
        cursor: "default",
      }}
    >
      {/* Number Badge */}
      <div
        style={{
          width: "28px", height: "28px", borderRadius: "50%",
          background: hovered ? accentColor : "#f1f5f9",
          color: hovered ? "#fff" : "#64748b",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Outfit', sans-serif",
          fontSize: "11px", fontWeight: 700,
          flexShrink: 0,
          transition: "background 0.2s, color 0.2s",
        }}
      >
        {index + 1}
      </div>

      {/* Name + Badges */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
        <span
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "14px",
            fontWeight: 500,
            color: "#111827",
          }}
        >
          {name}
        </span>
        {isCaptain && (
          <span style={{ fontSize: "10px", fontWeight: 700, color: "#b45309", background: "#fef3c7", border: "1px solid #fde68a", borderRadius: "4px", padding: "1px 6px", letterSpacing: "0.5px" }}>
            C
          </span>
        )}
        {isViceCaptain && (
          <span style={{ fontSize: "10px", fontWeight: 700, color: "#6b7280", background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: "4px", padding: "1px 6px", letterSpacing: "0.5px" }}>
            VC
          </span>
        )}
      </div>

      {/* Role Tag */}
      {role && (
        <div
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "11px",
            fontWeight: 500,
            background: roleStyle.bg,
            color: roleStyle.color,
            border: `1px solid ${roleStyle.border}`,
            borderRadius: "6px",
            padding: "2px 8px",
            flexShrink: 0,
            letterSpacing: "0.3px",
          }}
        >
          {role}
        </div>
      )}
    </div>
  );
}

// ─── Team Panel ──────────────────────────────────────────────────────────────
function TeamPanel({ team = {}, label, accentColor, isLoadingPlayers, lineup, getPlayerName, getPlayerRole }) {
  const playersList = lineup || team.players || [];
  const teamName = team?.shortName || team?.name || label;
  const count    = playersList.length;

  return (
    <div
      style={{
        flex: 1,
        background: "#ffffff",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)",
        minWidth: 0,
      }}
    >
      {/* Team Header */}
      <div
        style={{
          padding: "18px 20px",
          background: "#fff",
          borderBottom: "2px solid " + accentColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "6px", height: "32px", borderRadius: "3px",
              background: accentColor,
              flexShrink: 0,
            }}
          />
          <div>
            <h4
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "20px",
                fontWeight: 700,
                color: "#0f172a",
                margin: 0,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              {teamName}
            </h4>
            {team?.fullName && team.fullName !== teamName && (
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "11px", color: "#94a3b8", margin: "1px 0 0", fontWeight: 400 }}>
                {team.fullName}
              </p>
            )}
          </div>
        </div>

        <div
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "12px",
            fontWeight: 600,
            color: accentColor,
            background: accentColor + "12",
            border: `1px solid ${accentColor}30`,
            borderRadius: "20px",
            padding: "4px 12px",
          }}
        >
          {isLoadingPlayers ? "—" : count} players
        </div>
      </div>

      {/* Player List */}
      <div style={{ maxHeight: "480px", overflowY: "auto" }}>
        {isLoadingPlayers ? (
          [...Array(11)].map((_, i) => <SkeletonRow key={i} i={i} />)
        ) : !playersList.length ? (
          <div style={{ padding: "32px 20px", textAlign: "center" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>🏏</div>
            <p style={{ fontFamily: "'Outfit', sans-serif", color: "#94a3b8", fontSize: "13px", margin: 0 }}>
              No players available
            </p>
          </div>
        ) : (
          <>
            {playersList.slice(0, 15).map((p, i) => (
              <PlayerRow
                key={p?._id || p || i}
                player={p}
                index={i}
                accentColor={accentColor}
                getPlayerName={getPlayerName}
                getPlayerRole={getPlayerRole}
              />
            ))}
            {playersList.length > 15 && (
              <div
                style={{
                  padding: "10px 20px",
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "12px",
                  color: "#94a3b8",
                  background: "#fafbfc",
                  borderTop: "1px solid #f1f5f9",
                  textAlign: "center",
                }}
              >
                +{playersList.length - 15} more players
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
function Teams({ teamA = {}, teamB = {}, playerMap = {}, isLoadingPlayers = false }) {
  useGoogleFonts();

  const getPlayerName = (p) => {
    if (!p) return "Unknown Player";
    if (typeof p === "object" && p) return p.playerName || p.name || "Unknown Player";
    if (typeof p === "string") return playerMap?.[p] || p;
    return "Unknown Player";
  };

  const getPlayerRole = (p) => {
    if (typeof p === "object" && p) return p.role || "";
    return "";
  };

  return (
    <>
      {/* Shimmer keyframe */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div
        style={{
          fontFamily: "'Outfit', sans-serif",
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <TeamPanel
          team={teamA}
          label="Team A"
          accentColor="#2563eb"
          isLoadingPlayers={isLoadingPlayers}
          getPlayerName={getPlayerName}
          getPlayerRole={getPlayerRole}
        />
        <TeamPanel
          team={teamB}
          label="Team B"
          accentColor="#16a34a"
          isLoadingPlayers={isLoadingPlayers}
          getPlayerName={getPlayerName}
          getPlayerRole={getPlayerRole}
        />
      </div>
    </>
  );
}

export default Teams;