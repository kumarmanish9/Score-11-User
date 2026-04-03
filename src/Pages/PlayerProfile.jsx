import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPlayerById } from '../Services/playerService';
import "../assets/Styles/Global.css";

function PlayerProfile() {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsTab, setStatsTab] = useState('batting');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlayer();
  }, [id]);

  const fetchPlayer = async () => {
    try {
      setLoading(true);
      // TODO: Use playerService.getPlayerById(id)
      // Mock data for now
      setTimeout(() => {
        setPlayer({
          id,
          name: 'Virat Kohli',
          avatar: 'https://via.placeholder.com/200x200/3B82F6/FFFFFF?text=VK',
          role: 'Batsman',
          team: 'Royal Challengers Bengaluru',
          matches: 512,
          runs: 7265,
          average: 49.85,
          strikeRate: 132.52,
          fifties: 64,
          hundreds: 8,
          bio: 'Indian cricket captain and one of the greatest batsmen of all time.',
          recentMatches: [
            { opponent: 'MI', runs: 82, date: '2 days ago' },
            { opponent: 'CSK', runs: 54, date: '5 days ago' },
            { opponent: 'PBKS', runs: 101, date: '1 week ago' },
          ],
          achievements: ['Player of the Tournament 2023', 'Highest Run Scorer IPL 2024']
        });
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to load player profile');
      setLoading(false);
    }
  };

  const statsData = {
    batting: { matches: 512, runs: 7265, avg: 49.85, sr: 132.52, fifties: 64, hundreds: 8 },
    bowling: { matches: 12, wickets: 5, avg: 28.4, econ: 7.2 },
    fielding: { catches: 124, runouts: 8, stumpings: 0 }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gray-50">
        <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
          <span className="visually-hidden">Loading player...</span>
        </div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gray-50">
        <div className="text-center p-5">
          <h2 className="mb-4">Player Not Found</h2>
          <Link to="/players" className="btn btn-primary">Browse Players</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5 bg-gray-50 min-vh-100">
      <div className="container">
        {/* Hero Section */}
        <div className="row g-4 mb-5">
          <div className="col-lg-4 text-center text-lg-start">
            <div className="player-hero position-relative">
              <img 
                src={player.avatar} 
                alt={player.name}
                className="img-fluid rounded-circle shadow-lg mx-auto mx-lg-0"
                style={{width: '200px', height: '200px', objectFit: 'cover'}}
              />
              <div className="player-badge position-absolute bg-primary text-white rounded-pill px-3 py-1 small fw-bold">
                {player.role}
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <h1 className="display-3 fw-bold mb-3">{player.name}</h1>
            <div className="d-flex flex-wrap gap-3 mb-4">
              <span className="badge bg-success fs-6 px-4 py-2">{player.team}</span>
              <span className="badge bg-dark fs-6 px-4 py-2">Verified</span>
            </div>
            <p className="lead mb-4 text-gray-700">{player.bio}</p>
            <div className="d-flex gap-3 flex-wrap">
              <Link to="/contests" className="btn btn-primary btn-lg px-5">
                Create Team
              </Link>
              <Link to="/players" className="btn btn-outline-primary btn-lg px-5">
                Other Players
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Tabs */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white border-0 pb-0">
                <ul className="nav nav-tabs border-0 gap-3 flex-wrap justify-content-center justify-content-lg-start">
                  <li className="nav-item">
                    <button 
                      className={`nav-link fw-semibold border-0 px-4 py-3 rounded-top-0 ${
                        statsTab === 'batting' ? 'text-primary border-primary' : 'text-gray-600'
                      }`}
                      onClick={() => setStatsTab('batting')}
                    >
                      Batting
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link fw-semibold border-0 px-4 py-3 rounded-top-0 ${
                        statsTab === 'bowling' ? 'text-primary border-primary' : 'text-gray-600'
                      }`}
                      onClick={() => setStatsTab('bowling')}
                    >
                      Bowling
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link fw-semibold border-0 px-4 py-3 rounded-top-0 ${
                        statsTab === 'fielding' ? 'text-primary border-primary' : 'text-gray-600'
                      }`}
                      onClick={() => setStatsTab('fielding')}
                    >
                      Fielding
                    </button>
                  </li>
                </ul>
              </div>
              <div className="card-body p-5">
                <div className="row g-4 text-center text-lg-start">
                  <div className="col-md-3">
                    <div className="stat-card h-100 p-4 bg-white rounded-3 shadow-sm border-start border-primary border-4">
                      <div className="h5 text-muted mb-1">Matches</div>
                      <div className="display-4 fw-bold text-primary">{statsData[statsTab].matches}</div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="stat-card h-100 p-4 bg-white rounded-3 shadow-sm">
                      <div className="h5 text-muted mb-1">{statsTab === 'bowling' ? 'Wickets' : 'Runs'}</div>
                      <div className="display-4 fw-bold text-success">{statsData[statsTab].runs || statsData[statsTab].wickets}</div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="stat-card h-100 p-4 bg-white rounded-3 shadow-sm">
                      <div className="h5 text-muted mb-1">Average</div>
                      <div className="h2 fw-bold text-info">{statsData[statsTab].avg}</div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="stat-card h-100 p-4 bg-white rounded-3 shadow-sm">
                      <div className="h5 text-muted mb-1">{statsTab === 'batting' ? 'SR' : 'Economy'}</div>
                      <div className="h2 fw-bold text-warning">{statsData[statsTab].sr || statsData[statsTab].econ}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Matches */}
        <div className="row mb-5">
          <div className="col-12">
            <h2 className="h3 fw-bold mb-4 pb-2 border-bottom">Recent Matches</h2>
            <div className="row g-4">
              {player.recentMatches.map((match, index) => (
                <div key={index} className="col-lg-4 col-md-6">
                  <div className="card h-100 hover-lift">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="badge bg-success">vs {match.opponent}</span>
                        <span className="text-muted small">{match.date}</span>
                      </div>
                      <h4 className="card-title fw-bold mb-2">{match.runs} runs</h4>
                      <div className="progress mb-3" style={{height: '8px'}}>
                        <div className="progress-bar bg-primary" style={{width: '75%'}} />
                      </div>
                      <Link to="#" className="btn btn-outline-primary mt-2">
                        Match Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="row">
          <div className="col-12">
            <h2 className="h3 fw-bold mb-4 pb-2 border-bottom">Achievements</h2>
            <div className="row g-3">
              {player.achievements.map((achievement, index) => (
                <div key={index} className="col-md-4 col-lg-3">
                  <div className="card text-center p-4 hover-scale bg-gradient-primary text-white">
                    <div className="h4 fw-bold mb-2">{achievement}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerProfile;
