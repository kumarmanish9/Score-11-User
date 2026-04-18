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
import { getPlayerById } from '../Services/playerService';
import WagonWheel from '../Components/Match/WagonWheel';
import { io } from 'socket.io-client';
import '../assets/Styles/Global.css';
import './LiveControl.css'; // New styles

const LiveControl = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Match state
  const [match, setMatch] = useState(null);
  const [liveData, setLiveData] = useState(null);
  const [team1Players, setTeam1Players] = useState([]);
  const [team2Players, setTeam2Players] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Control state
  const [striker, setStrikerLocal] = useState('');
  const [nonStriker, setNonStrikerLocal] = useState('');
  const [bowler, setBowlerLocal] = useState('');
  const [currentOver, setCurrentOver] = useState(1);
  const [currentBall, setCurrentBall] = useState(1);
  const [inningsNumber, setInningsNumber] = useState(1);
  const [shotData, setShotData] = useState({ direction: 'straight', distance: 50 });
  
  // Socket
  useEffect(() => {
    let socket;
    const token = localStorage.getItem('token');
    if (token) {
      socket = initMatchSocket(token);
      joinMatchRoom(id);
      
      socket.on('liveScoreUpdate', (data) => {
        setLiveData(data);
        // Auto-update over/ball from backend
        if (data.currentOver) setCurrentOver(data.currentOver);
        if (data.currentBall) setCurrentBall(data.currentBall);
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
      
      // Load playing XI
      const team1 = await getTeamById(matchData.team1._id);
      const team2 = await getTeamById(matchData.team2._id);
      
      const p1 = await Promise.all(team1.players.slice(0,11).map(getPlayerById));
      const p2 = await Promise.all(team2.players.slice(0,11).map(getPlayerById));
      setTeam1Players(p1);
      setTeam2Players(p2);
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
    }, 2000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    fetchMatch();
  }, [fetchMatch]);

  // 🔥 QUICK ACTION HANDLERS (CricHero Style)
  const handleQuickShot = async (runs, type = 'normal', extras = 0) => {
    if (!striker || !bowler) {
      alert('Select striker and bowler first!');
      return;
    }

    const ballData = {
      batsman: striker,
      bowler,
      runs,
      type,
      extras,
      overNumber: currentOver,
      ballNumber: currentBall,
      ...shotData
    };

    try {
      await addBall(id, ballData);
      // Auto-advance ball counter
      let nextBall = currentBall + 1;
      let nextOver = currentOver;
      if (nextBall > 6) {
        nextBall = 1;
        nextOver += 1;
      }
      setCurrentBall(nextBall);
      setCurrentOver(nextOver);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleWicket = () => handleQuickShot(0, 'wicket');
  const handleDot = () => handleQuickShot(0);
  const handleSingle = () => handleQuickShot(1);
  const handleTwo = () => handleQuickShot(2);
  const handleThree = () => handleQuickShot(3);
  const handleFour = () => handleQuickShot(4);
  const handleSix = () => handleQuickShot(6);
  const handleWide = () => handleQuickShot(1, 'wide', 1);
  const handleNoBall = () => handleQuickShot(1, 'no_ball', 1);
  const handleBye = () => handleQuickShot(1, 'bye', 1);

  // Player controls
  const handleSetStriker = async () => {
    if (striker) await setStriker(id, striker);
  };
  const handleSetNonStriker = async () => {
    if (nonStriker) await setNonStriker(id, nonStriker);
  };  
  const handleSetBowler = async () => {
    if (bowler) await setBowler(id, bowler);
  };

  // Innings controls
  const handleStartInnings = async () => {
    await startInnings(id, inningsNumber);
  };
  const handleEndInnings = async () => {
    await endInnings(id);
    setInningsNumber(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="live-control-loading">
        <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <h3>Loading Live Control...</h3>
      </div>
    );
  }

  return (
    <div className="live-control-container">
      {/* 🔥 HEADER */}
      <div className="live-control-header">
        <button className="btn-back" onClick={() => navigate(`/match/${id}`)}>
          ← Live Match
        </button>
        <h1>🎮 LIVE CONTROL</h1>
        <div className="match-info">
          <h3>{match?.matchId}</h3>
          <div className="live-score">
            {liveData?.score?.team1?.runs || 0}/{liveData?.score?.team1?.wickets || 0} 
            ({liveData?.score?.team1?.overs || '0.0'} Ov)
          </div>
        </div>
      </div>

      <div className="live-control-grid">
        {/* 🔥 MAIN CONTROL PANEL */}
        <div className="control-panel">
          {/* OVERS DISPLAY */}
          <div className="overs-display">
            <h2>{currentOver}.{currentBall}</h2>
            <span>Innings {inningsNumber}</span>
          </div>

          {/* WAGON WHEEL */}
          <div className="wagon-wheel">
            <WagonWheel shotData={shotData} onShotChange={setShotData} />
          </div>

          {/* 🔥 QUICK RUNS - CRICHERO STYLE */}
          <div className="quick-actions">
            <h4>QUICK SHOTS</h4>
            <div className="runs-grid">
              <button className="btn-dot" onClick={handleDot}>.</button>
              <button className="btn-run" onClick={handleSingle}>1</button>
              <button className="btn-run" onClick={handleTwo}>2</button>
              <button className="btn-run" onClick={handleThree}>3</button>
              <button className="btn-four" onClick={handleFour}>4</button>
              <button className="btn-six" onClick={handleSix}>6</button>
            </div>
            <div className="extras-grid">
              <button className="btn-wide" onClick={handleWide}>WD</button>
              <button className="btn-noball" onClick={handleNoBall}>NB</button>
              <button className="btn-bye" onClick={handleBye}>BYE</button>
              <button className="btn-wicket" onClick={handleWicket}>WKT</button>
            </div>
          </div>

          {/* INNINGS CONTROL */}
          <div className="innings-control">
            <button className="btn-start-innings" onClick={handleStartInnings}>
              ▶️ Start Innings {inningsNumber}
            </button>
            <button className="btn-end-innings" onClick={handleEndInnings}>
              ⏹️ End Innings
            </button>
          </div>
        </div>

        {/* 🔥 PLAYER SELECTION */}
        <div className="player-panel">
          <h4>PLAYERS</h4>
          
          {/* STRIKER */}
          <div className="player-select">
            <label>Striker</label>
            <select value={striker} onChange={(e) => setStrikerLocal(e.target.value)}>
              <option value="">Select Striker</option>
              {team1Players.map(p => (
                <option key={p._id} value={p._id}>{p.playerName}</option>
              ))}
              {team2Players.map(p => (
                <option key={p._id} value={p._id}>{p.playerName}</option>
              ))}
            </select>
            <button className="btn-set-player" onClick={handleSetStriker}>SET</button>
          </div>

          {/* NON-STRIKER */}
          <div className="player-select">
            <label>Non-Striker</label>
            <select value={nonStriker} onChange={(e) => setNonStrikerLocal(e.target.value)}>
              <option value="">Select Non-Striker</option>
              {[...team1Players, ...team2Players].map(p => (
                <option key={p._id} value={p._id}>{p.playerName}</option>
              ))}
            </select>
            <button className="btn-set-player" onClick={handleSetNonStriker}>SET</button>
          </div>

          {/* BOWLER */}
          <div className="player-select">
            <label>Bowler</label>
            <select value={bowler} onChange={(e) => setBowlerLocal(e.target.value)}>
              <option value="">Select Bowler</option>
              {[...team1Players, ...team2Players].map(p => (
                <option key={p._id} value={p._id}>{p.playerName}</option>
              ))}
            </select>
            <button className="btn-set-player" onClick={handleSetBowler}>SET</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveControl;

