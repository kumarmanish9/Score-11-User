import React from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  .ss-wrap {
    background: #fff;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 2px 20px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04);
    font-family: 'DM Sans', sans-serif;
  }

  .ss-title {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 800;
    color: #111;
    margin: 0 0 18px;
    letter-spacing: -0.3px;
  }

  .ss-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 10px;
  }

  /* Card */
  .ss-card {
    border-radius: 16px;
    border: 1.5px solid #efefef;
    background: #fafafa;
    padding: 18px 14px 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    position: relative;
    overflow: hidden;
    transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
    text-align: center;
  }

  .ss-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.08);
    border-color: #e0e0e0;
  }

  /* Unique top accent per card */
  .ss-card:nth-child(1)::before { background: linear-gradient(90deg,#6366f1,#8b5cf6); }
  .ss-card:nth-child(2)::before { background: linear-gradient(90deg,#f5c500,#fb923c); }
  .ss-card:nth-child(3)::before { background: linear-gradient(90deg,#ef4444,#f97316); }
  .ss-card:nth-child(4)::before { background: linear-gradient(90deg,#22c55e,#4ade80); }
  .ss-card:nth-child(5)::before { background: linear-gradient(90deg,#0ea5e9,#38bdf8); }
  .ss-card:nth-child(6)::before { background: linear-gradient(90deg,#ec4899,#f43f5e); }

  .ss-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    border-radius: 3px 3px 0 0;
  }

  /* Icon */
  .ss-icon {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    margin-bottom: 2px;
    flex-shrink: 0;
  }

  .ss-card:nth-child(1) .ss-icon { background: #ede9fe; }
  .ss-card:nth-child(2) .ss-icon { background: #fef9c3; }
  .ss-card:nth-child(3) .ss-icon { background: #fee2e2; }
  .ss-card:nth-child(4) .ss-icon { background: #dcfce7; }
  .ss-card:nth-child(5) .ss-icon { background: #e0f2fe; }
  .ss-card:nth-child(6) .ss-icon { background: #fce7f3; }

  .ss-value {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 800;
    color: #111;
    line-height: 1;
    margin: 0;
    letter-spacing: -0.8px;
  }

  .ss-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: #bbb;
    margin: 0;
    line-height: 1.3;
  }
`;

const CARD_META = [
  { icon: "🏏" },
  { icon: "🏃" },
  { icon: "🎯" },
  { icon: "⭐" },
  { icon: "📊" },
  { icon: "🎳" },
];

function StatsSection({ user }) {
  const stats = user?.cricketProfile;

  const data = [
    { label: "Matches",    value: stats?.matchesPlayed    },
    { label: "Runs",       value: stats?.totalRuns        },
    { label: "Wickets",    value: stats?.totalWickets     },
    { label: "High Score", value: stats?.highestScore     },
    { label: "Bat Avg",    value: stats?.battingAverage   },
    { label: "Bowl Avg",   value: stats?.bowlingAverage   },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="ss-wrap">
        <h3 className="ss-title">Cricket Stats</h3>
        <div className="ss-grid">
          {data.map((item, index) => (
            <div className="ss-card" key={index}>
              <div className="ss-icon">{CARD_META[index].icon}</div>
              <p className="ss-value">{item.value ?? 0}</p>
              <p className="ss-label">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default StatsSection;