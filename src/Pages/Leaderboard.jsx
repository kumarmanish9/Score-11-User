import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../assets/Styles/Global.css";

const mockLeaderboard = [
  { rank: 1, name: 'Virat Kohli', points: 12540, avatar: 'https://via.placeholder.com/60', change: '+120' },
  { rank: 2, name: 'Rohit Sharma', points: 11890, avatar: 'https://via.placeholder.com/60', change: '+95' },
  { rank: 3, name: 'Jasprit Bumrah', points: 11230, avatar: 'https://via.placeholder.com/60', change: '+80' },
  { rank: 4, name: 'KL Rahul', points: 10980, avatar: 'https://via.placeholder.com/60', change: '-15' },
  { rank: 5, name: 'Hardik Pandya', points: 10750, avatar: 'https://via.placeholder.com/60', change: '+45' },
  { rank: 6, name: 'Rishabh Pant', points: 10520, avatar: 'https://via.placeholder.com/60', change: '+30' },
  { rank: 7, name: 'Shubman Gill', points: 10210, avatar: 'https://via.placeholder.com/60', change: '+65' },
  { rank: 8, name: 'Mohammed Siraj', points: 9980, avatar: 'https://via.placeholder.com/60', change: '-20' },
  { rank: 9, name: 'Suryakumar Yadav', points: 9850, avatar: 'https://via.placeholder.com/60', change: '+110' },
  { rank: 10, name: 'Kuldeep Yadav', points: 9720, avatar: 'https://via.placeholder.com/60', change: '+55' },
];

function Leaderboard() {
  const [activeTab, setActiveTab] = useState('weekly');
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'all-time', label: 'All Time' },
  ];

  const fetchLeaderboard = async (tab) => {
    setLoading(true);
    // TODO: Integrate with leaderboardService.js when available
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="py-5 bg-gray-50 min-vh-100">
      <div className="container">
        <div className="row mb-5">
          <div className="col-lg-8">
            <nav className="d-flex gap-2 mb-4">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`btn px-4 py-2 rounded-pill fw-semibold border-0 ${
                    activeTab === tab.id 
                      ? 'bg-blue-500 text-white shadow-sm' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setActiveTab(tab.id);
                    fetchLeaderboard(tab.id);
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
            <h1 className="display-4 fw-bold mb-3">Leaderboard</h1>
            <p className="lead text-gray-700 mb-0">
              Top players ranked by fantasy points. Climb the ranks and win rewards!
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="spinner-border text-blue-500 mb-3" style={{width: '3rem', height: '3rem'}} />
            <p className="text-muted">Loading leaderboard...</p>
          </div>
        ) : (
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light sticky-top">
                    <tr>
                      <th>Rank</th>
                      <th>Player</th>
                      <th>Fantasy Points</th>
                      <th>Change</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockLeaderboard.map((player, index) => (
                      <tr key={index} className={player.rank <= 3 ? 'table-active fw-semibold' : ''}>
                        <td className="fs-4 fw-bold text-primary">
                          <div className="rank-badge p-3 rounded-circle bg-primary text-white d-inline-block text-center" style={{width: '48px', height: '48px', lineHeight: '24px'}}>
                            #{player.rank}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <img 
                              src={player.avatar} 
                              alt={player.name}
                              className="rounded-circle" 
                              style={{width: '56px', height: '56px'}}
                            />
                            <div>
                              <div className="fw-bold">{player.name}</div>
                              <small className="text-muted">Score11 PRO</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="fw-bold fs-5 text-success">{player.points.toLocaleString()}</div>
                        </td>
                        <td>
                          <span className={`badge fs-6 px-3 py-2 fw-semibold ${
                            player.change.startsWith('+') ? 'bg-success' : 'bg-danger'
                          }`}>
                            {player.change}
                          </span>
                        </td>
                        <td>
                          <Link to={`/players/${player.name.toLowerCase().replace(' ', '-')}`} className="btn btn-outline-primary btn-sm px-4">
                            View Profile
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-center mt-5 p-5 bg-white rounded-3 shadow-sm">
                <h3 className="mb-3">Your Rank</h3>
                <div className="display-3 fw-bold text-muted mb-2">#47</div>
                <p className="lead text-muted mb-4">8,450 points <span className="badge bg-success ms-2">+120 this week</span></p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Link to="/contests" className="btn btn-primary btn-lg px-5">
                    Join Contests
                  </Link>
                  <Link to="/profile" className="btn btn-outline-primary btn-lg px-5">
                    Improve Rank
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <Link to="/leaderboard" className="btn btn-outline-primary btn-lg px-5 me-3">
            More Players
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;

