import React, { useState, useEffect } from "react";
import { getLeaderboard, getBatsmanLeaderboard, getBowlerLeaderboard, getTeamLeaderboard } from "../Services/leaderboardService";
import "../assets/Styles/Global.css";

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('overall');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard(activeTab);
  }, [activeTab]);

  const loadLeaderboard = async (tab) => {
    setLoading(true);
    try {
      let data;
      switch (tab) {
        case 'overall':
          data = await getLeaderboard();
          break;
        case 'batsmen':
          data = await getBatsmanLeaderboard();
          break;
        case 'bowlers':
          data = await getBowlerLeaderboard();
          break;
        case 'teams':
          data = await getTeamLeaderboard();
          break;
        default:
          data = [];
      }
      console.log('Leaderboard data sample:', data[0]);      setLeaderboardData(data);
    } catch (err) {
      console.error('Leaderboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overall', label: 'Overall Leaderboard' },
    { id: 'batsmen', label: 'Top Batsmen' },
    { id: 'bowlers', label: 'Top Bowlers' },
    { id: 'teams', label: 'Top Teams' },
  ];

  return (
    <div className="min-vh-100 bg-gray-50 py-5">
      <div className="container">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            <h1 className="display-4 fw-bold mb-3">🏆 Leaderboard</h1>
            <p className="lead text-muted">Top performers across the season</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="card shadow-lg border-0 mb-4">
          <div className="card-body p-0">
            <div className="nav nav-pills nav-fill">
              {tabs.map(tab => (
                <button key={tab.id} className={`nav-link px-4 py-3 fw-bold flex-grow-1 ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="card shadow-xl border-0">
          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} />
                <p className="mt-3 text-muted">Loading leaderboard...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>Rank</th>
                      <th>Player/Team</th>
                      <th>Points</th>
                      <th>Matches</th>
                      <th>Avg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.map((entry, index) => (
                      <tr key={entry._id || index}>
                        <td className="fw-bold fs-4 text-gold">
                          #{index + 1}
                        </td>
                        <td>
                          <div className="fw-bold">{entry.name || entry.teamName}</div>
<small className="text-muted">{entry.team?.name || entry.team?.shortName || entry.category || 'N/A'}</small>
                        </td>
                        <td className="fw-bold fs-5 text-success">{entry.points?.toLocaleString() || 0}</td>
                        <td>{entry.matches || entry.games || 0}</td>
                        <td>{entry.average?.toFixed(1) || '-'}</td>
                      </tr>
                    ))}
                    {leaderboardData.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center py-5 text-muted">
                          No data available for this leaderboard
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
