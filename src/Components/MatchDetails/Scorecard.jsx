import React from "react";
import "./Scorecard.css";
function Scorecard({ scorecard, loading, teamMap }) {

  if (loading) return <p className="text-center">Loading scorecard...</p>;

  if (!scorecard) return <p className="text-center">No scorecard available</p>;

  return (
    <div className="scorecard-container">

      {/* 🏏 HEADER */}
      <div className="inning-card">
        <div className="inning-header">
          <h3>
            {teamMap[scorecard?.battingTeam] || "Batting Team"}
            <span>
              {scorecard?.runs || 0}/{scorecard?.wickets || 0} ({scorecard?.overs || "0.0"})
            </span>
          </h3>
        </div>

        {/* 📊 MATCH INFO */}
        <div className="match-info">
          <p><strong>Run Rate:</strong> {scorecard?.runRate || "0.00"}</p>
        </div>

        {/* ➕ EXTRAS */}
        <div className="extras-box">
          <p>
            <strong>Extras:</strong> {scorecard?.extras?.total || 0}
            <span>
              (Wd: {scorecard?.extras?.wides || 0}, 
              Nb: {scorecard?.extras?.noBalls || 0}, 
              B: {scorecard?.extras?.byes || 0}, 
              Lb: {scorecard?.extras?.legByes || 0})
            </span>
          </p>
        </div>

        {/* 🟢 BATTING */}
        <div className="table-section">
          <h5>Batting</h5>

          {scorecard?.battingScorecard?.length === 0 ? (
            <p className="no-data">No batting data yet</p>
          ) : (
            <table className="score-table">
              <thead>
                <tr>
                  <th>Batter</th>
                  <th>R</th>
                  <th>B</th>
                  <th>4s</th>
                  <th>6s</th>
                  <th>SR</th>
                </tr>
              </thead>

              <tbody>
                {(scorecard?.battingScorecard || []).map((b, i) => ( 
                  <tr key={i}>
                    <td>{b.playerName}</td>
                    <td className="highlight">{b.runs}</td>
                    <td>{b.balls}</td>
                    <td>{b.fours}</td>
                    <td>{b.sixes}</td>
                    <td>{b.strikeRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 🔵 BOWLING */}
        <div className="table-section">
          <h5>Bowling</h5>

          {scorecard?.bowlingScorecard?.length === 0 ? (
            <p className="no-data">No bowling data yet</p>
          ) : (
            <table className="score-table">
              <thead>
                <tr>
                  <th>Bowler</th>
                  <th>O</th>
                  <th>R</th>
                  <th>W</th>
                  <th>Econ</th>
                </tr>
              </thead>

              <tbody>
                {(scorecard?.bowlingScorecard || []).map((b, i) => (
                  <tr key={i}>
                    <td>{b.playerName}</td>
                    <td>{b.overs}</td>
                    <td>{b.runs}</td>
                    <td className="wicket">{b.wickets}</td>
                    <td>{b.economy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}

export default Scorecard;