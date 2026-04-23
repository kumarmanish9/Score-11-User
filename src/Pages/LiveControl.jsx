import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getMatchDetails,
  initMatchSocket,
  joinMatchRoom,
  leaveMatchRoom,
  getLiveScore,
  initializeMatch,
  setStriker,
  setNonStriker,
  setBowler,
  addBall,
  startInnings,
  endInnings
} from '../Services/matchService';
import { getTeamById } from '../Services/teamService';
import { getPlayerById, searchPlayers } from '../Services/playerService';
import { addPlayerToTeam } from '../Services/teamService';
import { startMatch } from '../Services/matchService';
import WagonWheel from '../Components/Match/WagonWheel';
import { io } from 'socket.io-client';
import '../assets/Styles/Global.css';
import './LiveControl.css';

const LiveControl = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Match state
  const [match, setMatch] = useState(null);
  const [liveData, setLiveData] = useState(null);
  const [team1Players, setTeam1Players] = useState([]);
  const [team2Players, setTeam2Players] = useState([]); // Fixed: added = sign
  const [loading, setLoading] = useState(true);
  const [shotsHistory, setShotsHistory] = useState([]);

// Control state
  const [striker, setStrikerLocal] = useState('');
  const [nonStriker, setNonStrikerLocal] = useState('');
  const [bowler, setBowlerLocal] = useState('');
  const [currentOver, setCurrentOver] = useState(1);
  const [currentBall, setCurrentBall] = useState(1);
  const [inningsNumber, setInningsNumber] = useState(1);
  const [currentInnings, setCurrentInnings] = useState(1);
  const [matchStarted, setMatchStarted] = useState(false);
  
  // Team management state
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [team1Id, setTeam1Id] = useState('');
  const [team2Id, setTeam2Id] = useState('');
  
  // Wagon wheel shot data
  const [selectedShot, setSelectedShot] = useState(null);
  const [showShotPreview, setShowShotPreview] = useState(false);

  // Socket connection
  useEffect(() => {
    let socket;
    const token = localStorage.getItem('token');
    if (token) {
      socket = initMatchSocket(token);
      joinMatchRoom(id);

      socket.on('liveScoreUpdate', (data) => {
        setLiveData(data);
        if (data.currentOver) setCurrentOver(data.currentOver);
        if (data.currentBall) setCurrentBall(data.currentBall);
        if (data.currentInnings) setCurrentInnings(data.currentInnings);
      });
      
      socket.on('turnUpdate', (data) => {
        setStrikerLocal(data.striker || '');
        setNonStrikerLocal(data.nonStriker || '');
        setBowlerLocal(data.bowler || '');
      });
      
      socket.on('ballUpdate', (data) => {
        setShotsHistory(prev => [data, ...prev].slice(0, 20));
        if (data.runs === 4 || data.runs === 6) {
          // Highlight boundary shots
          setSelectedShot(data);
          setTimeout(() => setSelectedShot(null), 2000);
        }
      });
    }

    return () => {
      if (socket) {
        leaveMatchRoom(id);
        socket.disconnect();
      }
    };
  }, [id]);

  // Fetch match data
  const fetchMatch = useCallback(async () => {
    try {
      setLoading(true);
      const matchData = await getMatchDetails(id);
      setMatch(matchData);
      setMatchStarted(matchData.status === 'live');

      try {
        const team1 = await getTeamById(matchData.team1._id);
        const team2 = await getTeamById(matchData.team2._id);

        const p1 = await Promise.allSettled(team1.players.slice(0, 11).map(getPlayerById));
        const p2 = await Promise.allSettled(team2.players.slice(0, 11).map(getPlayerById));

        setTeam1Players(p1.filter(r => r.status === 'fulfilled').map(r => r.value));
        setTeam2Players(p2.filter(r => r.status === 'fulfilled').map(r => r.value));
      } catch (playerErr) {
        console.warn('Player load partial fail:', playerErr);
        setTeam1Players([]);
        setTeam2Players([]);
      }
    } catch (err) {
      console.error('Match load error:', err);
      navigate('/matches');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  // Live score polling backup
  useEffect(() => {
    const interval = setInterval(() => {
      getLiveScore(id).then(setLiveData).catch(console.error);
    }, 3000);
    return () => clearInterval(interval);
  }, [id]);

  // Search players for team management
  const searchAvailablePlayers = useCallback(async (query) => {
    if (!query.trim()) {
      setAvailablePlayers([]);
      return;
    }
    setLoadingPlayers(true);
    try {
      const players = await searchPlayers(query);
      setAvailablePlayers(players);
    } catch (err) {
      console.error('Player search error:', err);
      setAvailablePlayers([]);
    } finally {
      setLoadingPlayers(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => searchAvailablePlayers(searchQuery), 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchAvailablePlayers]);

  // Add player to team
  const handleAddPlayer = async (playerId, teamId) => {
    try {
      await addPlayerToTeam(teamId, playerId);
      alert('Player added to team!');
      fetchMatch(); // Refresh teams
      setSearchQuery(''); 
    } catch (err) {
      alert('Error adding player: ' + err.message);
    }
  };

  // Start match handler
  const handleStartMatch = async () => {
    try {
      await startMatch(id);
      navigate(`/match/${id}/toss`);
    } catch (err) {
      alert('Error starting match: ' + err.message);
    }
  };

  useEffect(() => {
    if (match) {
      setTeam1Id(match.team1?._id);
      setTeam2Id(match.team2?._id);
    }
  }, [match]);

  useEffect(() => {
    fetchMatch();
  }, [fetchMatch]);

  // Handle shot from wagon wheel
  const handleShotFromWheel = async (shot) => {
    if (!striker || !bowler) {
      alert('Please select striker and bowler first!');
      return;
    }

    if (!matchStarted) {
      alert('Please start the innings first!');
      return;
    }

    // Calculate runs based on shot distance and region
    let runs = 1;
    if (shot.distance > 85) runs = 6;
    else if (shot.distance > 70) runs = 4;
    else if (shot.distance > 50) runs = 3;
    else if (shot.distance > 30) runs = 2;
    
    // Adjust runs based on region
    const bigHitRegions = ['longon', 'longoff', 'straight'];
    if (bigHitRegions.includes(shot.region) && shot.distance > 60) {
      runs = Math.min(runs + 1, 6);
    }

    const ballData = {
      batsman: striker,
      bowler: bowler,
      runs: runs,
      type: runs === 0 ? 'dot' : 'normal',
      extras: 0,
      overNumber: currentOver,
      ballNumber: currentBall,
      direction: shot.direction || shot.region,
      distance: shot.distance,
      region: shot.region
    };

    try {
      await addBall(id, ballData);
      
      // Update over/ball counter
      let nextBall = currentBall + 1;
      let nextOver = currentOver;
      if (nextBall > 6) {
        nextBall = 1;
        nextOver += 1;
      }
      setCurrentBall(nextBall);
      setCurrentOver(nextOver);
      
      // Show shot preview
      setSelectedShot({ ...ballData, runs });
      setShowShotPreview(true);
      setTimeout(() => setShowShotPreview(false), 1500);
      
    } catch (err) {
      alert('Error adding ball: ' + err.message);
    }
  };

  // Quick run buttons (fallback)
  const handleQuickRun = async (runs, type = 'normal') => {
    if (!striker || !bowler) {
      alert('Please select striker and bowler first!');
      return;
    }

    if (!matchStarted) {
      alert('Please start the innings first!');
      return;
    }

    const ballData = {
      batsman: striker,
      bowler: bowler,
      runs: runs,
      type: type,
      extras: type === 'wide' || type === 'no_ball' ? 1 : 0,
      overNumber: currentOver,
      ballNumber: currentBall,
      direction: 'straight',
      distance: runs === 6 ? 90 : runs === 4 ? 75 : 40
    };

    try {
      await addBall(id, ballData);
      
      let nextBall = currentBall + 1;
      let nextOver = currentOver;
      if (nextBall > 6) {
        nextBall = 1;
        nextOver += 1;
      }
      setCurrentBall(nextBall);
      setCurrentOver(nextOver);
      
      setSelectedShot({ ...ballData, runs });
      setShowShotPreview(true);
      setTimeout(() => setShowShotPreview(false), 1500);
      
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // Player controls
  const handleSetStriker = async () => {
    if (striker) {
      await setStriker(id, striker);
      alert('Striker set successfully!');
    }
  };
  
  const handleSetNonStriker = async () => {
    if (nonStriker) {
      await setNonStriker(id, nonStriker);
      alert('Non-striker set successfully!');
    }
  };
  
  const handleSetBowler = async () => {
    if (bowler) {
      await setBowler(id, bowler);
      alert('Bowler set successfully!');
    }
  };

  // Innings controls
  const handleStartInnings = async () => {
    try {
      await startInnings(id, inningsNumber);
      setMatchStarted(true);
      alert(`Innings ${inningsNumber} started!`);
    } catch (err) {
      alert('Error starting innings: ' + err.message);
    }
  };
  
  const handleEndInnings = async () => {
    try {
      await endInnings(id);
      setMatchStarted(false);
      setInningsNumber(prev => prev + 1);
      setCurrentOver(1);
      setCurrentBall(1);
      alert(`Innings ended!`);
    } catch (err) {
      alert('Error ending innings: ' + err.message);
    }
  };

  // Get player name by ID
  const getPlayerName = (id) => {
    const allPlayers = [...team1Players, ...team2Players];
    const player = allPlayers.find(p => p._id === id);
    return player ? player.playerName : 'Unknown';
  };

  if (loading) {
    return (
      <div className="live-control-loading">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <h3>Loading Live Control...</h3>
      </div>
    );
  }

  const currentScore = liveData?.score?.team1?.runs || 0;
  const currentWickets = liveData?.score?.team1?.wickets || 0;
  const currentOvers = liveData?.score?.team1?.overs || '0.0';

  return (
    <div className="live-control-container">
      {/* Shot Preview Toast */}
      {showShotPreview && selectedShot && (
        <div className={`shot-preview-toast ${selectedShot.runs === 6 ? 'six' : selectedShot.runs === 4 ? 'four' : ''}`}>
          <div className="shot-preview-content">
            <span className="shot-runs">{selectedShot.runs}</span>
            <span className="shot-direction">{selectedShot.direction?.toUpperCase()}</span>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="live-control-header">
        <button className="btn-back" onClick={() => navigate(`/match/${id}`)}>
          ← Back to Match
        </button>
        <div className="header-title">
          <h1>🎮 LIVE CONTROL</h1>
          <div className="match-badge">{match?.matchId}</div>
        </div>
        <div className="live-score-badge">
          <div className="score-number">{currentScore}/{currentWickets}</div>
          <div className="score-overs">{currentOvers} ov</div>
        </div>
      </div>

      <div className="live-control-grid">
        {/* WAGON WHEEL SECTION */}
        <div className="wagon-wheel-section">
          <div className="section-header">
            <h3>🏏 SHOT SELECTOR</h3>
            <span className="instruction">Click on field to place shot</span>
          </div>
          <WagonWheel
            shotData={selectedShot || {}}
            onShotChange={handleShotFromWheel}
            replayShots={shotsHistory}
            height={400}
            onShotAdd={handleShotFromWheel}
          />
        </div>

        {/* MAIN CONTROL PANEL */}
        <div className="control-panel">
          {/* OVERS DISPLAY */}
          <div className="overs-display">
            <div className="current-over-box">
              <span className="over-label">Current Over</span>
              <span className="over-number">{currentOver}.{currentBall}</span>
            </div>
            <div className="innings-box">
              <span className="innings-label">Innings</span>
              <span className="innings-number">{inningsNumber}</span>
            </div>
            <div className="status-box">
              <span className={`status-badge ${matchStarted ? 'live' : 'pending'}`}>
                {matchStarted ? 'LIVE' : 'NOT STARTED'}
              </span>
            </div>
          </div>

          {/* CURRENT PLAYERS */}
          <div className="current-players">
            <div className="player-card striker">
              <div className="player-role">🏏 STRIKER</div>
              <div className="player-name">{getPlayerName(striker) || 'Not Set'}</div>
            </div>
            <div className="vs-icon">⚡</div>
            <div className="player-card bowler">
              <div className="player-role">🎯 BOWLER</div>
              <div className="player-name">{getPlayerName(bowler) || 'Not Set'}</div>
            </div>
          </div>

          {/* QUICK RUN BUTTONS */}
          <div className="quick-actions">
            <h4>QUICK SHOTS</h4>
            <div className="runs-grid">
              <button className="btn-dot" onClick={() => handleQuickRun(0, 'dot')}>•</button>
              <button className="btn-run" onClick={() => handleQuickRun(1)}>1</button>
              <button className="btn-run" onClick={() => handleQuickRun(2)}>2</button>
              <button className="btn-run" onClick={() => handleQuickRun(3)}>3</button>
              <button className="btn-four" onClick={() => handleQuickRun(4)}>4</button>
              <button className="btn-six" onClick={() => handleQuickRun(6)}>6</button>
            </div>
            <div className="extras-grid">
              <button className="btn-wide" onClick={() => handleQuickRun(1, 'wide')}>WIDE</button>
              <button className="btn-noball" onClick={() => handleQuickRun(1, 'no_ball')}>NO BALL</button>
              <button className="btn-bye" onClick={() => handleQuickRun(1, 'bye')}>BYE</button>
              <button className="btn-wicket" onClick={() => handleQuickRun(0, 'wicket')}>WICKET</button>
            </div>
          </div>

          {/* INNINGS CONTROL */}
          <div className="innings-control">
            <button 
              className="btn-start-innings" 
              onClick={handleStartInnings}
              disabled={matchStarted}
            >
              ▶ START INNINGS {inningsNumber}
            </button>
            <button 
              className="btn-end-innings" 
              onClick={handleEndInnings}
              disabled={!matchStarted}
            >
              ⏹ END INNINGS
            </button>
          </div>
        </div>

        {/* PLAYER SELECTION PANEL */}
        <div className="player-panel">
          <h4>👥 PLAYER SELECTION</h4>
          
          <div className="team-section">
            <h5>{match?.team1?.teamName || 'Team 1'}</h5>
            <select 
              className="player-select" 
              value={striker} 
              onChange={(e) => setStrikerLocal(e.target.value)}
            >
              <option value="">Select Striker</option>
              {team1Players.map(p => (
                <option key={p._id} value={p._id}>{p.playerName}</option>
              ))}
            </select>
            <select 
              className="player-select" 
              value={nonStriker} 
              onChange={(e) => setNonStrikerLocal(e.target.value)}
            >
              <option value="">Select Non-Striker</option>
              {team1Players.map(p => (
                <option key={p._id} value={p._id}>{p.playerName}</option>
              ))}
            </select>
          </div>

          <div className="team-section">
            <h5>{match?.team2?.teamName || 'Team 2'}</h5>
            <select 
              className="player-select" 
              value={bowler} 
              onChange={(e) => setBowlerLocal(e.target.value)}
            >
              <option value="">Select Bowler</option>
              {team2Players.map(p => (
                <option key={p._id} value={p._id}>{p.playerName}</option>
              ))}
            </select>
          </div>

          <div className="player-action-buttons">
            <button className="btn-set-player" onClick={handleSetStriker}>Set Striker</button>
            <button className="btn-set-player" onClick={handleSetNonStriker}>Set Non-Striker</button>
            <button className="btn-set-player" onClick={handleSetBowler}>Set Bowler</button>
          </div>
        </div>
      </div>

      {/* SHOT HISTORY */}
      <div className="shot-history">
        <h4>📊 RECENT SHOTS</h4>
        <div className="history-list">
          {shotsHistory.slice(0, 8).map((shot, idx) => (
            <div key={idx} className={`history-item ${shot.runs === 6 ? 'six' : shot.runs === 4 ? 'four' : ''}`}>
              <span className="history-over">{shot.overNumber}.{shot.ballNumber}</span>
              <span className="history-runs">{shot.runs}</span>
              <span className="history-direction">{shot.direction || shot.region}</span>
            </div>
          ))}
          {shotsHistory.length === 0 && (
            <div className="history-empty">No shots recorded yet. Click on the wagon wheel to start!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveControl;