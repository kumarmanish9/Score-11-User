import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaPlay, FaClock, FaCheckCircle } from 'react-icons/fa';
import { getPlayerMatches } from '../Services/playerService';

const PlayerMatches = ({ playerId }) => {
  const [matches, setMatches] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recent');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMatches();
  }, [playerId]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const types = ['recent', 'scheduled', 'live', 'lineup'];
      const promises = types.map(type => getPlayerMatches(playerId, type));
      const results = await Promise.all(promises);
      
      const matchesObj = {};
      types.forEach((type, index) => {
        matchesObj[type] = results[index] || [];
      });
      
      setMatches(matchesObj);
    } catch (err) {
      console.error('Error fetching player matches:', err);
      setError('Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: 'recent', label: 'Recent Matches', icon: FaCheckCircle },
    { key: 'scheduled', label: 'Scheduled', icon: FaCalendarAlt },
    { key: 'live', label: 'Live Matches', icon: FaPlay },
    { key: 'lineup', label: 'Lineup Matches', icon: FaClock }
  ];

  const currentMatches = matches[activeTab] || [];

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTeamNames = (match) => {
    const team1Name = match.team1?.name || match.team1?.shortName || 'Team 1';
    const team2Name = match.team2?.name || match.team2?.shortName || 'Team 2';
    return `${team1Name} vs ${team2Name}`;
  };

  if (loading) {
    return <div className="text-center py-8"><div className="spinner-border" role="status"></div></div>;
  }

  return (
    <div className="stats-card mb-5">
      <div className="stats-header">
        <div className="stats-tabs">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`stats-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <tab.icon size={14} /> {tab.label} <span className="badge bg-light ms-1">{matches[tab.key]?.length || 0}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="stats-body p-4">
        {error ? (
          <div className="alert alert-warning text-center">{error}</div>
        ) : currentMatches.length === 0 ? (
          <div className="text-center py-8 text-muted">
            <FaCalendarAlt size={48} className="mb-3 opacity-50" />
            <p>No {activeTab} matches found for this player</p>
          </div>
        ) : (
          <div className="row g-3">
            {currentMatches.slice(0, 6).map((match) => (
              <div key={match._id} className="col-md-6 col-lg-4">
                <div className="match-card h-100">
                  <div className="match-header" style={{ background: getStatusColor(match.status) }}>
                    <div className="match-opponent fw-bold">{getTeamNames(match)}</div>
                    <div className="match-date">
                      <FaCalendarAlt size={10} /> {formatDate(match.scheduledDate)}
                    </div>
                  </div>
                  <div className="match-body">
                    {match.status === 'live' && (
                      <div className="badge bg-danger mb-2">LIVE</div>
                    )}
                    {match.tournament && (
                      <small className="text-muted mb-2 d-block">{match.tournament.name}</small>
                    )}
                    <Link to={`/match/${match._id}`} className="btn btn-sm btn-outline-primary w-100">
                      View Match
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  const colors = {
    'completed': 'linear-gradient(135deg, #10b981, #059669)',
    'scheduled': 'linear-gradient(135deg, #3b82f6, #2563eb)',
    'live': 'linear-gradient(135deg, #ef4444, #dc2626)',
    'ready': 'linear-gradient(135deg, #f59e0b, #d97706)',
    'team-selecting': 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
  };
  return colors[status] || 'linear-gradient(135deg, #6b7280, #4b5563)';
};

export default PlayerMatches;

