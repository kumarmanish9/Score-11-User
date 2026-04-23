import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

// COMPONENTS
import Scorecard from "../Components/MatchDetails/Scorecard";
import BallByBall from "../Components/MatchDetails/BallByBall";
import Teams from "../Components/MatchDetails/Teams";
import WagonWheel from "../Components/Match/WagonWheel";

// SERVICES
import {
  getMatchDetails,
  getMatchTimeline,
  getLiveScore,
  getScorecard,
  startMatch
} from '../Services/matchService';

import { 
  FaRocket, 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaTrophy, 
  FaUsers, 
  FaChartLine, 
  FaInfoCircle,
FaBaseballBall,
  FaArrowLeft,
  FaMicrophone,
  FaClipboardList,
  FaUserCog,
  FaEye
} from "react-icons/fa";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .match-details-page {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
    min-height: 100vh;
    padding: 30px 0;
  }

  /* Header Card */
  .match-header-card {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
    margin-bottom: 30px;
  }

  .match-header-content {
    padding: 30px;
    color: white;
  }

  .tournament-badge {
    background: rgba(255,255,255,0.2);
    backdrop-filter: blur(10px);
    padding: 8px 20px;
    border-radius: 30px;
    font-size: 13px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    transition: all 0.2s ease;
  }

  .tournament-badge:hover {
    background: rgba(255,255,255,0.3);
    transform: translateY(-2px);
  }

  .match-title {
    font-size: 28px;
    font-weight: 800;
    margin-bottom: 12px;
  }

  .match-info {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    font-size: 14px;
    color: rgba(255,255,255,0.8);
    margin-bottom: 20px;
  }

  .match-info-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .start-match-btn {
    background: linear-gradient(135deg, #f59e0b, #f97316);
    border: none;
    padding: 14px 28px;
    border-radius: 16px;
    font-weight: 800;
    font-size: 16px;
    color: white;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  .start-match-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
  }

  /* Live Score Section */
  .live-score-section {
    background: white;
    border-radius: 20px;
    padding: 20px;
    margin: 0 20px 20px 20px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  }

  .score-card {
    text-align: center;
    padding: 20px;
    border-radius: 16px;
    transition: all 0.2s ease;
  }

  .score-card:hover {
    background: #f8fafc;
    transform: translateY(-4px);
  }

  .team-name {
    font-size: 18px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 12px;
  }

  .team-score {
    font-size: 36px;
    font-weight: 800;
    color: #3b82f6;
    margin-bottom: 8px;
  }

  .team-overs {
    font-size: 14px;
    color: #64748b;
  }

  .vs-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 800;
    color: #cbd5e1;
  }

  /* Status Badge */
  .status-badge {
    display: inline-block;
    padding: 10px 24px;
    border-radius: 40px;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 1px;
    margin-bottom: 30px;
  }

  .status-live {
    background: #dc2626;
    color: white;
    animation: pulse 1.5s infinite;
  }

  .status-completed {
    background: #10b981;
    color: white;
  }

  .status-scheduled {
    background: #f59e0b;
    color: white;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }

  /* Tabs */
  .tabs-container {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }

  .tab-btn {
    flex: 1;
    padding: 14px 20px;
    border-radius: 16px;
    font-weight: 700;
    font-size: 15px;
    transition: all 0.2s ease;
    border: none;
    cursor: pointer;
    font-family: inherit;
  }

  .tab-active {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  .tab-inactive {
    background: white;
    color: #64748b;
    border: 1px solid #e2e8f0;
  }

  .tab-inactive:hover {
    background: #f8fafc;
    transform: translateY(-2px);
  }

  /* Content Card */
  .content-card {
    background: white;
    border-radius: 20px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.08);
    overflow: hidden;
  }

  .content-body {
    padding: 30px;
  }

  /* Info Cards */
  .info-card {
    background: white;
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
    transition: all 0.2s ease;
  }

  .info-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  }

  .info-title {
    font-size: 16px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .info-content {
    font-size: 14px;
    color: #475569;
    line-height: 1.6;
  }

  /* Loading Spinner */
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
  }

  .custom-spinner {
    width: 60px;
    height: 60px;
    border: 3px solid rgba(59, 130, 246, 0.2);
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Responsive */
  @media (max-width: 768px) {
    .match-header-content {
      padding: 20px;
    }
    .match-title {
      font-size: 20px;
    }
    .team-score {
      font-size: 24px;
    }
    .tabs-container {
      gap: 8px;
    }
    .tab-btn {
      padding: 10px 12px;
      font-size: 12px;
    }
    .content-body {
      padding: 20px;
    }
    .vs-divider {
      margin: 10px 0;
    }
  }
`;

function MatchDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('live');
  const [error, setError] = useState('');

  const [timeline, setTimeline] = useState([]);
  const [liveScore, setLiveScore] = useState(null);
  const [scorecard, setScorecard] = useState({});
  const [playerMap, setPlayerMap] = useState({});
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(false);

  useEffect(() => {
    fetchMatch();
  }, [id]);

  const fetchMatch = async () => {
    try {
      setLoading(true);
      const data = await getMatchDetails(id);
      setMatch(data);
      await loadPlayers(data);
    } catch (err) {
      setError('Failed to load match details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval;
    const fetchLive = async () => {
      const data = await getLiveScore(id).catch(() => null);
      if (data) {
        setLiveScore(prev => {
          if (JSON.stringify(prev) !== JSON.stringify(data)) {
            return data;
          }
          return prev;
        });
      }
    };

    fetchLive();
    interval = setInterval(fetchLive, 3000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    if (activeTab === "commentary") fetchTimeline();
    if (activeTab === "scorecard") {
      fetchScorecard();
      const interval = setInterval(fetchScorecard, 5000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const loadPlayers = async (matchData) => {
    setIsLoadingPlayers(true);
    try {
      const teamA = matchData?.team1 || {};
      const teamB = matchData?.team2 || {};
      
      const allPlayerIds = [
        ...(teamA.players || []).map(p => p?._id || p).filter(Boolean),
        ...(teamB.players || []).map(p => p?._id || p).filter(Boolean),
        ...(matchData.team1Lineup || []).filter(Boolean),
        ...(matchData.team2Lineup || []).filter(Boolean)
      ].filter(id => typeof id === 'string' && id.length === 24);
      
      const uniqueIds = [...new Set(allPlayerIds)];
      
      if (uniqueIds.length > 0) {
        const { getPlayersByIds } = await import('../Services/playerService');
        const players = await getPlayersByIds(uniqueIds);
        setPlayerMap(players);
      }
    } catch (err) {
      console.error('Failed to load players:', err);
    } finally {
      setIsLoadingPlayers(false);
    }
  };

  const fetchTimeline = async () => {
    const data = await getMatchTimeline(id).catch(() => []);
    setTimeline(Array.isArray(data) ? data : data?.timeline || []);
  };

  const fetchScorecard = async () => {
    const data = await getScorecard(id).catch(() => ({}));
    setScorecard(data?.scorecard || {});
  };

  const handleStartMatch = async () => {
    if (!confirm('Start this match and proceed to toss?')) return;
    try {
      await startMatch(id);
      alert('✅ Match started! Redirecting to toss.');
      navigate(`/match/${id}/toss`);
    } catch (err) {
      alert('❌ Failed to start match: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="custom-spinner"></div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="match-details-page d-flex align-items-center justify-content-center">
        <div className="text-center p-5">
          <div className="mb-4">
            <FaBaseballBall size={60} style={{ color: '#cbd5e1' }} />
          </div>
          <h3 style={{ color: '#1e293b', marginBottom: '16px' }}>Match Not Found</h3>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>{error || 'The match you\'re looking for doesn\'t exist.'}</p>
          <Link to="/matches" className="btn btn-primary">Back to Matches</Link>
        </div>
      </div>
    );
  }

  const teamA = match?.team1 || {};
  const teamB = match?.team2 || {};
  const isScheduled = ['scheduled', 'team_selecting'].includes(match.status);

  const formatDateTime = (dateStr) => dateStr ? new Date(dateStr).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : 'TBD';

  const tabs = [
    { id: 'live', label: 'Live', icon: <FaEye /> },
    { id: 'scorecard', label: 'Scorecard', icon: <FaClipboardList /> },
    { id: 'commentary', label: 'Commentary', icon: <FaMicrophone /> },
    { id: 'teams', label: 'Teams', icon: <FaUsers /> }
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="match-details-page">
        <div className="container">
          {/* Header */}
          <div className="match-header-card">
            <div className="match-header-content">
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                <div>
                  {match.tournament && (
                    <Link to={`/tournament/${match.tournament._id}`} className="tournament-badge">
                      <FaTrophy size={14} />
                      {match.tournament.name}
                    </Link>
                  )}
                  <h1 className="match-title">
                    {teamA.shortName || teamA.name || 'Team A'} vs {teamB.shortName || teamB.name || 'Team B'}
                  </h1>
                  <div className="match-info">
                    <span className="match-info-item">
                      <FaCalendarAlt /> {formatDateTime(match.scheduledDate)}
                    </span>
                    <span className="match-info-item">
                      <FaMapMarkerAlt /> {match.venue?.name || 'TBD'}, {match.venue?.city || ''}
                    </span>
                    <span className="match-info-item">
                      <FaBaseballBall /> {match.format?.toUpperCase()} | {match.overs} overs
                    </span>
                  </div>
                </div>
                {isScheduled && (
                  <button className="start-match-btn" onClick={handleStartMatch}>
                    <FaRocket /> Start Match
                  </button>
                )}
              </div>
            </div>

            {/* Live Score */}
            {liveScore && (
              <div className="live-score-section">
                <div className="row align-items-center">
                  <div className="col-md-5">
                    <div className="score-card">
                      <div className="team-name">{teamA.name || 'Team A'}</div>
                      <div className="team-score">
                        {liveScore.score?.team1?.runs || 0}/{liveScore.score?.team1?.wickets || 0}
                      </div>
                      <div className="team-overs">
                        {liveScore.score?.team1?.overs || '0.0'} overs
                      </div>
                      {liveScore.score?.team1?.runRate && (
                        <div className="team-overs mt-1">
                          RR: {liveScore.score.team1.runRate}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-2 vs-divider">
                    VS
                  </div>
                  <div className="col-md-5">
                    <div className="score-card">
                      <div className="team-name">{teamB.name || 'Team B'}</div>
                      <div className="team-score">
                        {liveScore.score?.team2?.runs || 0}/{liveScore.score?.team2?.wickets || 0}
                      </div>
                      <div className="team-overs">
                        {liveScore.score?.team2?.overs || '0.0'} overs
                      </div>
                      {liveScore.score?.team2?.runRate && (
                        <div className="team-overs mt-1">
                          RR: {liveScore.score.team2.runRate}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {liveScore.currentRunRate && (
                  <div className="text-center mt-3 pt-2 border-top">
                    <small className="text-muted">
                      Current Run Rate: {liveScore.currentRunRate} | 
                      Required Run Rate: {liveScore.requiredRunRate || 'N/A'}
                    </small>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Status Badge */}
          <div className="text-center">
            <span className={`status-badge status-${match.status === 'live' ? 'live' : match.status === 'completed' ? 'completed' : 'scheduled'}`}>
              {match.status?.toUpperCase()}
            </span>
          </div>

          {/* Main Content */}
          <div className="row g-4">
            <div className="col-lg-8">
              {/* Tabs */}
              <div className="tabs-container">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    className={`tab-btn ${activeTab === tab.id ? 'tab-active' : 'tab-inactive'}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="content-card">
                <div className="content-body">
                  {activeTab === "live" && (
                    <div>
                      <h5 style={{ fontWeight: 800, marginBottom: 20, color: '#1e293b' }}>
                        Live Updates
                      </h5>
                      {liveScore ? (
                        <div>
                          <p><strong>Current Innings:</strong> {liveScore.currentInnings || 'First Innings'}</p>
                          <p><strong>Last Over:</strong> {liveScore.lastOver || 'N/A'}</p>
                          <p><strong>Recent Balls:</strong> {liveScore.recentBalls || 'N/A'}</p>
                          <p><strong>Partnership:</strong> {liveScore.partnership || '0 runs (0 balls)'}</p>
                          {liveScore.lastWicket && (
                            <p><strong>Last Wicket:</strong> {liveScore.lastWicket}</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-muted">Match updates will appear here once the match starts.</p>
                      )}
                    </div>
                  )}
                  {activeTab === "scorecard" && (
                    <Scorecard scorecard={scorecard} playerMap={playerMap} />
                  )}
                  {activeTab === "commentary" && (
                    <BallByBall timeline={timeline} />
                  )}
                  {activeTab === "teams" && (
                    <Teams 
                      teamA={teamA} 
                      teamB={teamB} 
                      playerMap={playerMap} 
                      isLoadingPlayers={isLoadingPlayers}
                      lineup={match.lineup}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              {/* Match Info */}
              <div className="info-card">
                <div className="info-title">
                  <FaClock /> Match Timeline
                </div>
                <div className="info-content">
                  <p><strong>Status:</strong> {match.status}</p>
                  <p><strong>Format:</strong> {match.format}</p>
                  <p><strong>Type:</strong> {match.matchType}</p>
                  <p><strong>Overs:</strong> {match.overs} per side</p>
                  {match.result && <p><strong>Result:</strong> {match.result}</p>}
                </div>
              </div>

              {/* Officials */}
              <div className="info-card">
                <div className="info-title">
                  <FaUserCog /> Match Officials
                </div>
                <div className="info-content">
                  <p><strong>Umpire:</strong> {match.officials?.umpire || "TBD"}</p>
                  <p><strong>TV Umpire:</strong> {match.officials?.tvUmpire || "TBD"}</p>
                  <p><strong>Referee:</strong> {match.officials?.referee || "TBD"}</p>
                  <p><strong>Scorer:</strong> {match.officials?.scorer || "TBD"}</p>
                </div>
              </div>

              {/* Match Stats */}
              {match.stats && (
                <div className="info-card">
                  <div className="info-title">
                    <FaChartLine /> Match Stats
                  </div>
                  <div className="info-content">
                    <p><strong>Total Runs:</strong> {match.stats.totalRuns || 0}</p>
                    <p><strong>Total Wickets:</strong> {match.stats.totalWickets || 0}</p>
                    <p><strong>Fours:</strong> {match.stats.fours || 0}</p>
                    <p><strong>Sixes:</strong> {match.stats.sixes || 0}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="text-center mt-5">
            <Link to="/scheduled-matches" className="btn btn-outline-primary me-3 px-4 py-2 rounded-pill">
              Scheduled Matches
            </Link>
            <Link to="/matches" className="btn btn-primary px-4 py-2 rounded-pill">
              All Matches
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default MatchDetails;