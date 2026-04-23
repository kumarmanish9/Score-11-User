import React from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  .ps-wrap {
    background: #fff;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 2px 20px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04);
    font-family: 'DM Sans', sans-serif;
  }

  .ps-title {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 800;
    color: #111;
    margin: 0 0 18px;
    letter-spacing: -0.3px;
  }

  .ps-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 10px;
  }

  /* Card */
  .ps-card {
    border-radius: 16px;
    border: 1.5px solid #efefef;
    background: #fafafa;
    padding: 20px 16px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    position: relative;
    overflow: hidden;
    transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
    text-align: center;
  }

  .ps-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.08);
    border-color: #e0e0e0;
  }

  /* Subtle top accent per card index */
  .ps-card:nth-child(1)::before { background: linear-gradient(90deg,#22c55e,#4ade80); }
  .ps-card:nth-child(2)::before { background: linear-gradient(90deg,#ef4444,#f97316); }
  .ps-card:nth-child(3)::before { background: linear-gradient(90deg,#6366f1,#8b5cf6); }
  .ps-card:nth-child(4)::before { background: linear-gradient(90deg,#f5c500,#fb923c); }

  .ps-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    border-radius: 3px 3px 0 0;
  }

  /* Icon circle */
  .ps-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    margin-bottom: 4px;
    flex-shrink: 0;
  }

  .ps-card:nth-child(1) .ps-icon { background: #dcfce7; }
  .ps-card:nth-child(2) .ps-icon { background: #fee2e2; }
  .ps-card:nth-child(3) .ps-icon { background: #ede9fe; }
  .ps-card:nth-child(4) .ps-icon { background: #fef9c3; }

  /* Value */
  .ps-value {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    font-weight: 800;
    color: #111;
    line-height: 1;
    margin: 0;
    letter-spacing: -1px;
  }

  /* Label */
  .ps-label {
    font-size: 11px;
    font-weight: 600;
    color: #bbb;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    margin: 0;
    line-height: 1.3;
  }
`;

const CARD_META = [
  { icon: "🏆", accentClass: "green"  },
  { icon: "📉", accentClass: "red"    },
  { icon: "🥇", accentClass: "purple" },
  { icon: "⭐", accentClass: "gold"   },
];

function PerformanceSection({ user }) {
  const stats = user?.stats;

  const data = [
    { label: "Matches Won",     value: stats?.matchesWon      },
    { label: "Matches Lost",    value: stats?.matchesLost     },
    { label: "Tournaments Won", value: stats?.tournamentsWon  },
    { label: "MOTM Awards",     value: stats?.manOfTheMatch   },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="ps-wrap">
        <h3 className="ps-title">Performance</h3>
        <div className="ps-grid">
          {data.map((item, index) => (
            <div className="ps-card" key={index}>
              <div className="ps-icon">{CARD_META[index].icon}</div>
              <p className="ps-value">{item.value ?? 0}</p>
              <p className="ps-label">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default PerformanceSection;