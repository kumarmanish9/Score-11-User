import React, { useEffect, useState } from "react";

// ─── Google Fonts Injector ──────────────────────────────────────────────────
function useGoogleFonts() {
  useEffect(() => {
    const id = "bbb-gfonts";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;500&family=DM+Sans:wght@400;500;600&display=swap";
      document.head.appendChild(link);
    }
  }, []);
}

// ─── Ball Event Classifier ──────────────────────────────────────────────────
function classifyBall(item) {
  const text = (item?.text || "").toLowerCase();
  const runs = item?.runs ?? item?.runsScored ?? null;

  if (item?.wicket || text.includes("out") || text.includes("wicket") || text.includes("caught") || text.includes("bowled") || text.includes("lbw") || text.includes("stumped") || text.includes("run out"))
    return "wicket";
  if (item?.six || text.includes("six") || runs === 6) return "six";
  if (item?.four || text.includes("four") || text.includes("boundary") || runs === 4) return "four";
  if (item?.wide || text.includes("wide")) return "wide";
  if (item?.noBall || text.includes("no ball") || text.includes("no-ball")) return "noball";
  if (runs === 0 || text.includes("dot ball") || text.includes("no run")) return "dot";
  return "run";
}

const BALL_CONFIG = {
  wicket: { bg: "#ef4444",   border: "#dc2626", text: "#fff",    label: "W",  glow: "rgba(239,68,68,0.35)"   },
  six:    { bg: "#7c3aed",   border: "#6d28d9", text: "#fff",    label: "6",  glow: "rgba(124,58,237,0.35)"  },
  four:   { bg: "#2563eb",   border: "#1d4ed8", text: "#fff",    label: "4",  glow: "rgba(37,99,235,0.35)"   },
  wide:   { bg: "#f59e0b",   border: "#d97706", text: "#fff",    label: "Wd", glow: "rgba(245,158,11,0.3)"   },
  noball: { bg: "#f97316",   border: "#ea580c", text: "#fff",    label: "Nb", glow: "rgba(249,115,22,0.3)"   },
  dot:    { bg: "#f3f4f6",   border: "#d1d5db", text: "#6b7280", label: "•",  glow: "transparent"            },
  run:    { bg: "#f0fdf4",   border: "#bbf7d0", text: "#15803d", label: "✓",  glow: "transparent"            },
};

// ─── Animated Row ───────────────────────────────────────────────────────────
function BallRow({ item, index }) {
  const [visible, setVisible] = useState(false);
  const type   = classifyBall(item);
  const config = BALL_CONFIG[type];

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 40);
    return () => clearTimeout(t);
  }, [index]);

  const isSpecial = type === "wicket" || type === "six" || type === "four";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "14px",
        padding: "14px 20px",
        borderBottom: "1px solid #f1f5f9",
        background: isSpecial ? `${config.bg}08` : "transparent",
        borderLeft: isSpecial ? `3px solid ${config.border}` : "3px solid transparent",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}
    >
      {/* Over.Ball Badge */}
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "11px",
          fontWeight: 500,
          color: "#94a3b8",
          minWidth: "36px",
          paddingTop: "2px",
          flexShrink: 0,
        }}
      >
        {item.over}.{item.ball}
      </div>

      {/* Ball Circle */}
      <div
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          background: config.bg,
          border: `2px solid ${config.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: type === "wide" || type === "noball" ? "10px" : "14px",
          color: config.text,
          flexShrink: 0,
          boxShadow: isSpecial ? `0 0 10px ${config.glow}` : "none",
          letterSpacing: "0.5px",
        }}
      >
        {config.label}
      </div>

      {/* Commentary Text */}
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "13.5px",
          lineHeight: "1.55",
          color: type === "wicket" ? "#b91c1c" : type === "six" ? "#5b21b6" : "#374151",
          fontWeight: type === "wicket" ? 600 : type === "six" ? 500 : 400,
          margin: 0,
          paddingTop: "5px",
          flex: 1,
        }}
      >
        {item.text}
      </p>

      {/* Special Tag */}
      {isSpecial && (
        <div
          style={{
            flexShrink: 0,
            background: config.bg,
            color: config.text,
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "11px",
            letterSpacing: "1px",
            padding: "3px 8px",
            borderRadius: "6px",
            alignSelf: "center",
          }}
        >
          {type.toUpperCase()}
        </div>
      )}
    </div>
  );
}

// ─── Legend ─────────────────────────────────────────────────────────────────
function Legend() {
  const items = [
    { type: "wicket", label: "Wicket" },
    { type: "six",    label: "Six"    },
    { type: "four",   label: "Four"   },
    { type: "wide",   label: "Wide"   },
    { type: "dot",    label: "Dot"    },
    { type: "run",    label: "Run"    },
  ];
  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
        padding: "12px 20px",
        borderBottom: "1px solid #f1f5f9",
        background: "#fafbfc",
      }}
    >
      {items.map(({ type, label }) => {
        const c = BALL_CONFIG[type];
        return (
          <div key={type} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                background: c.bg,
                border: `1.5px solid ${c.border}`,
              }}
            />
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                color: "#6b7280",
                fontWeight: 500,
              }}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
function BallByBall({ timeline, loading }) {
  useGoogleFonts();

  // ✅ Loading state
  if (loading) {
    return (
      <div style={stateStyle}>
        <div style={spinnerStyle} />
        <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#94a3b8", fontSize: "14px", marginTop: "12px" }}>
          Loading commentary…
        </p>
      </div>
    );
  }

  // ✅ Empty state
  if (!Array.isArray(timeline) || timeline.length === 0) {
    return (
      <div style={stateStyle}>
        <div style={{ fontSize: "32px", marginBottom: "8px" }}>🏏</div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#94a3b8", fontSize: "14px" }}>
          No commentary available
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)",
        overflow: "hidden",
        maxWidth: "680px",
        width: "100%",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "18px 20px 16px",
          borderBottom: "1px solid #f1f5f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#fff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "18px" }}>🏏</span>
          <h4
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "18px",
              letterSpacing: "2px",
              color: "#111",
              margin: 0,
            }}
          >
            BALL BY BALL
          </h4>
        </div>
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "11px",
            color: "#94a3b8",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "6px",
            padding: "3px 10px",
          }}
        >
          {timeline.length} events
        </span>
      </div>

      {/* Legend */}
      <Legend />

      {/* Ball Rows */}
      <div style={{ maxHeight: "520px", overflowY: "auto" }}>
        {timeline.map((item, i) => (
          <BallRow key={i} item={item} index={i} />
        ))}
      </div>
    </div>
  );
}

// ─── State Styles ────────────────────────────────────────────────────────────
const stateStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "48px 24px",
  background: "#fff",
  borderRadius: "16px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.07)",
  maxWidth: "680px",
  margin: "0 auto",
};

const spinnerStyle = {
  width: "28px",
  height: "28px",
  border: "3px solid #f1f5f9",
  borderTop: "3px solid #3b82f6",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
};

export default BallByBall;