import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPlayerById } from '../Services/playerService';
import "../assets/Styles/Global.css";
import defaultAvatar from "../assets/Styles/Logo.png";

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
      setError('');

      const res = await getPlayerById(id);

      // service returns data or object depending on implementation
      const data = res?.data || res || null;

      if (!data) {
        throw new Error('No player data');
      }

      // Normalize player object fields with safe defaults
      const normalized = {
        _id: data._id || data.id || id,
        name: data.name || data.playerName || data.fullName || 'Unknown Player',
        avatar: data.avatar?.url || data.avatar || data.image || defaultAvatar,
        role: data.role || data.position || 'Player',
        team: data.team?.name || data.team || data.teamName || 'Unknown Team',
        bio: data.bio || data.description || '',
        recentMatches: Array.isArray(data.recentMatches) ? data.recentMatches : (Array.isArray(data.matchesList) ? data.matchesList : []),
        achievements: Array.isArray(data.achievements) ? data.achievements : (data.awards ? [data.awards].flat() : []),
        stats: data.stats || data.statistics || null,
      };

      setPlayer(normalized);
    } catch (err) {
      console.error('Player fetch error:', err);
      setError('Failed to load player profile');
      setPlayer(null);
    } finally {
      setLoading(false);
    }
  };

  // Prefer player-provided stats when available; ensure safe defaults per tab
  const defaultStats = {
    batting: { matches: 0, runs: 0, avg: 0, sr: 0, fifties: 0, hundreds: 0 },
    bowling: { matches: 0, wickets: 0, avg: 0, econ: 0 },
    fielding: { matches: 0, catches: 0, runouts: 0, stumpings: 0 }
  };

  const statsData = (player && player.stats) ? player.stats : defaultStats;
  const statsForTab = statsData[statsTab] || defaultStats[statsTab];

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
          <h2 className="mb-4">{error || 'Player Not Found'}</h2>
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
                      <div className="display-4 fw-bold text-primary">{statsForTab.matches}</div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="stat-card h-100 p-4 bg-white rounded-3 shadow-sm">
                      <div className="h5 text-muted mb-1">{statsTab === 'bowling' ? 'Wickets' : 'Runs'}</div>
                      <div className="display-4 fw-bold text-success">{statsForTab.runs || statsForTab.wickets}</div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="stat-card h-100 p-4 bg-white rounded-3 shadow-sm">
                      <div className="h5 text-muted mb-1">Average</div>
                      <div className="h2 fw-bold text-info">{statsForTab.avg}</div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="stat-card h-100 p-4 bg-white rounded-3 shadow-sm">
                      <div className="h5 text-muted mb-1">{statsTab === 'batting' ? 'SR' : 'Economy'}</div>
                      <div className="h2 fw-bold text-warning">{statsForTab.sr || statsForTab.econ}</div>
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
