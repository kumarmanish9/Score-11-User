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
import { FaSpinner, FaPlay, FaStop, FaUser, FaBowlingBall } from 'react-icons/fa';

const LiveControl = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [liveData, setLiveData] = useState(null);
  const [team1Players, setTeam1Players] = useState([]);
  const [team2Players, setTeam2Players] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shotsHistory, setShotsHistory] = useState([]);

  const [strikerId, setStrikerId] = useState('');
  const [nonStrikerId, setNonStrikerId] = useState('');
  const [bowlerId, setBowlerId] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [matchStarted, setMatchStarted] = useState(false);
  const [currentInnings, setCurrentInnings] = useState(1);
  const [lastBall, setLastBall] = useState(null);
  const [ballHistory, setBallHistory] = useState([]);

  useEffect(() => {
    let socket;
    const token = localStorage.getItem('token');
    if (token && id) {
      socket = io(import.meta.env.VITE_BACKEND_URL || 'http://68.178.171.95:3000', {
        auth: { token }
      });
      joinMatchRoom(id);

      socket.on('liveScoreUpdate', (data) => {
        setLiveData(data);
        setIsInitialized(data.initialized || false);
        setMatchStarted(data.match?.status === 'live');
        setCurrentInnings(data.match?.currentInnings || 1);
      });

      // 🔄 Handle striker rotation updates from backend wagon wheel scoring
      socket.on('turnUpdate', (data) => {
        console.log('🔄 Turn update:', data);
        if (data.currentStriker) setStrikerId(data.currentStriker);
        if (data.currentNonStriker) setNonStrikerId(data.currentNonStriker);
      });

      socket.on('connect', () => console.log('🔴 Live socket connected'));
    }

    return () => {
      if (socket) {
        leaveMatchRoom(id);
        socket.disconnect();
      }
    };
  }, [id]);

  const fetchMatch = useCallback(async () => {
    try {
      setLoading(true);
      const matchData = await getMatchDetails(id);
      setMatch(matchData);

      const [team1, team2] = await Promise.all([
        getTeamById(matchData.team1._id).catch(() => ({ players: [] })),
        getTeamById(matchData.team2._id).catch(() => ({ players: [] }))
      ]);

      setTeam1Players(team1.players.slice(0, 11) || []);
      setTeam2Players(team2.players.slice(0, 11) || []);

      const live = await getLiveScore(id).catch(() => ({}));
      setLiveData(live);
      setIsInitialized(live.initialized || false);
      setMatchStarted(matchData.status === 'live');
    } catch (err) {
      console.error('Match load error:', err);
      navigate('/matches');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchMatch();
  }, [fetchMatch]);

  // 🔥 FIXED: handleQuickScore now handles BOTH number (buttons) AND shot object (wagon wheel)
  const handleQuickScore = async (runsOrShot, type = 'normal') => {
    if (!isInitialized || !matchStarted || !strikerId || !bowlerId) {
      alert('⚠️ Set striker, bowler & start innings first!');
      return;
    }

    try {
      // Handle wagon wheel shot object OR quick button number
      let runs = runsOrShot;
      if (typeof runsOrShot === 'object' && runsOrShot.runs !== undefined) {
        runs = runsOrShot.runs;
        type = 'normal'; // Wagon wheel is always normal delivery
        console.log('🎯 Wagon wheel shot:', runsOrShot, '→ Scoring', runs, 'runs');
      }

      const ballData = {
        batsmanId: strikerId,
        bowlerId: bowlerId,
        runs: Number(runs), // Ensure number
        type,
        comment: `${runs} run${runs !== 1 ? 's' : ''}${type !== 'normal' ? ` (${type.toUpperCase()})` : ''}`
      };

      console.log('📤 Sending ballData:', ballData);

      setLastBall({ runs, type });
      setBallHistory(prev => [...prev.slice(-11), { runs, type }]);
      
      // Add shot to history for wagon visualization
      if (typeof runsOrShot === 'object') {
        setShotsHistory(prev => [...prev.slice(-20), runsOrShot]);
      }

      await addBall(id, ballData);
      console.log('✅ Ball scored successfully');
      
    } catch (err) {
      console.error('Scoring error:', err);
      alert(`❌ Scoring failed: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleWicket = () => handleQuickScore(0, 'wicket');

  const handleInitialize = async () => {
    if (team1Players.length < 11) {
      alert('Add 11 players to batting team first!');
      return;
    }

    try {
      const battingOrder = [{
        team: match.team1._id,
        players: team1Players.map(p => p._id)
      }];
      await initializeMatch(id, battingOrder);
      setIsInitialized(true);
      alert('✅ Scoring initialized!');
      fetchMatch();
    } catch (err) {
      alert('Init error: ' + err.message);
    }
  };

  const handleStartInnings = async () => {
    try {
      await startInnings(id, currentInnings);
      setMatchStarted(true);
      alert(`▶️ Innings ${currentInnings} started!`);
    } catch (err) {
      alert('Start error: ' + err.message);
    }
  };

  const handleEndInnings = async () => {
    try {
      await endInnings(id);
      setCurrentInnings(prev => prev + 1);
      setMatchStarted(false);
      alert(`⏹ Innings ${currentInnings} ended!`);
    } catch (err) {
      alert('End error: ' + err.message);
    }
  };

  const setPlayerRole = async (role, playerId) => {
    try {
      switch (role) {
        case 'striker': await setStriker(id, playerId); break;
        case 'non-striker': await setNonStriker(id, playerId); break;
        case 'bowler': await setBowler(id, playerId); break;
      }
      alert(`${role.toUpperCase()} set!`);
    } catch (err) {
      alert('Set error: ' + err.message);
    }
  };

  const getPlayerName = (playerId) => {
    const allPlayers = [...team1Players, ...team2Players];
    const player = allPlayers.find(p => p._id === playerId);
    return player?.playerName || '—';
  };

  const getBallColor = (ball) => {
    if (!ball) return '#334155';
    if (ball.type === 'wicket') return '#ef4444';
    if (ball.type === 'wide' || ball.type === 'no_ball') return '#8b5cf6';
    if (ball.runs === 6) return '#f59e0b';
    if (ball.runs === 4) return '#10b981';
    if (ball.runs === 0) return '#475569';
    return '#3b82f6';
  };

  const getBallLabel = (ball) => {
    if (!ball) return '•';
    if (ball.type === 'wicket') return 'W';
    if (ball.type === 'wide') return 'Wd';
    if (ball.type === 'no_ball') return 'Nb';
    if (ball.type === 'bye') return 'B';
    return ball.runs;
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="lc-loading">
          <div className="lc-loading-inner">
            <div className="lc-spinner" />
            <div className="lc-loading-text">LOADING LIVE CONTROL</div>
            <div className="lc-loading-sub">Connecting to match server...</div>
          </div>
        </div>
      </>
    );
  }

  const score = liveData?.scorecard || {};
  const currentScore = `${score.runs || 0}/${score.wickets || 0}`;
  const overs = score.overs || '0.0';
  const runRate = liveData?.scorecard?.runRate || '0.00';

  return (
    <>
      <style>{styles}</style>
      <div className="lc-root">

        {/* Ambient background */}
        <div className="lc-bg-orb lc-orb-1" />
        <div className="lc-bg-orb lc-orb-2" />
        <div className="lc-bg-orb lc-orb-3" />

        {/* ─── HEADER ─── */}
        <header className="lc-header">
          <div className="lc-header-inner">
            <div className="lc-header-left">
              <button className="lc-back-btn" onClick={() => navigate(`/match/${id}`)}>
                <span className="lc-back-arrow">←</span>
                <span>Match</span>
              </button>
              <div>
                <div className="lc-header-title">
                  <span className="lc-dot-live" />
                  LIVE CONTROL
                </div>
                <div className="lc-match-id">{match?.matchId || id}</div>
              </div>
            </div>

            <div className="lc-header-score-block">
              <div className="lc-big-score">{currentScore}</div>
              <div className="lc-overs-label">{overs} ov &nbsp;·&nbsp; RR {runRate}</div>
              <div className={`lc-status-badge ${matchStarted ? 'lc-badge-live' : 'lc-badge-ready'}`}>
                {matchStarted ? '● LIVE' : '○ READY'}
              </div>
            </div>
          </div>
        </header>

        {/* ─── MAIN GRID ─── */}
        <div className="lc-grid">

          {/* ══ LEFT / MAIN ══ */}
          <div className="lc-main">

            {/* Ball History Strip */}
            {ballHistory.length > 0 && (
              <div className="lc-card lc-ball-strip-card">
                <div className="lc-section-label">THIS OVER</div>
                <div className="lc-ball-strip">
                  {ballHistory.map((b, i) => (
                    <div
                      key={i}
                      className="lc-ball-dot"
                      style={{ background: getBallColor(b), boxShadow: `0 0 12px ${getBallColor(b)}80` }}
                    >
                      {getBallLabel(b)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wagon Wheel */}
            <div className="lc-card lc-wagon-card">
              <div className="lc-card-header">
                <span className="lc-card-title">🏏 Wagon Wheel</span>
                <span className="lc-tag">Click to score</span>
              </div>
              <WagonWheel
                height={380}
                onShotChange={handleQuickScore}
                replayShots={shotsHistory}
              />
              {/* Wagon wheel now ✅ FIXED - extracts shot.runs correctly */}
            </div>

            {/* Quick Score */}
            <div className="lc-card lc-score-card">
              <div className="lc-card-header">
                <span className="lc-card-title">Quick Score</span>
                <span className="lc-tag lc-tag-orange">Tap to record</span>
              </div>

              {/* Run buttons */}
              <div className="lc-run-grid">
                <button
                  className="lc-run-btn lc-run-dot"
                  onClick={() => handleQuickScore(0)}
                  disabled={!isInitialized || !matchStarted}
                  title="Dot ball"
                >
                  <span className="lc-run-icon">●</span>
                  <span className="lc-run-label">Dot</span>
                </button>
                {[1, 2, 3].map(r => (
                  <button
                    key={r}
                    className="lc-run-btn lc-run-single"
                    onClick={() => handleQuickScore(r)}
                    disabled={!isInitialized || !matchStarted}
                  >
                    <span className="lc-run-num">{r}</span>
                    <span className="lc-run-label">{r === 1 ? 'Single' : r === 2 ? 'Double' : 'Triple'}</span>
                  </button>
                ))}
                <button
                  className="lc-run-btn lc-run-four"
                  onClick={() => handleQuickScore(4)}
                  disabled={!isInitialized || !matchStarted}
                >
                  <span className="lc-run-num">4</span>
                  <span className="lc-run-label">FOUR</span>
                </button>
                <button
                  className="lc-run-btn lc-run-six"
                  onClick={() => handleQuickScore(6)}
                  disabled={!isInitialized || !matchStarted}
                >
                  <span className="lc-run-num">6</span>
                  <span className="lc-run-label">SIX</span>
                </button>
              </div>

              {/* Extras & Wicket */}
              <div className="lc-extras-grid">
                {[
                  { label: 'Wide', short: 'Wd', cls: 'lc-extra-wide', handler: () => handleQuickScore(1, 'wide') },
                  { label: 'No Ball', short: 'Nb', cls: 'lc-extra-noball', handler: () => handleQuickScore(1, 'no_ball') },
                  { label: 'Bye', short: 'B', cls: 'lc-extra-bye', handler: () => handleQuickScore(1, 'bye') },
                  { label: 'WICKET', short: '⚡', cls: 'lc-extra-wicket', handler: handleWicket },
                ].map(btn => (
                  <button
                    key={btn.label}
                    className={`lc-extra-btn ${btn.cls}`}
                    onClick={btn.handler}
                    disabled={!isInitialized || !matchStarted}
                  >
                    <span className="lc-extra-short">{btn.short}</span>
                    <span className="lc-extra-label">{btn.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ══ RIGHT / PANEL ══ */}
          <div className="lc-panel">

            {/* Innings Control */}
            <div className="lc-card lc-innings-card">
              <div className="lc-section-label">INNINGS CONTROL</div>
              <div className="lc-innings-num">
                Innings <span>{currentInnings}</span>
              </div>

              {!isInitialized ? (
                <button
                  className="lc-ctrl-btn lc-btn-init"
                  onClick={handleInitialize}
                  disabled={team1Players.length < 11}
                >
                  <FaPlay />
                  Initialize Scoring
                  {team1Players.length < 11 && (
                    <span className="lc-btn-note">Need 11 players in Team 1</span>
                  )}
                </button>
              ) : (
                <div className="lc-ctrl-stack">
                  <button
                    className="lc-ctrl-btn lc-btn-start"
                    onClick={handleStartInnings}
                    disabled={matchStarted}
                  >
                    <FaPlay />
                    Start Innings {currentInnings}
                  </button>
                  <button
                    className="lc-ctrl-btn lc-btn-end"
                    onClick={handleEndInnings}
                    disabled={!matchStarted}
                  >
                    <FaStop />
                    End Innings
                  </button>
                </div>
              )}
            </div>

            {/* Player Selection */}
            <div className="lc-card lc-players-card">
              <div className="lc-section-label">PLAYER SELECTION</div>

              {/* Striker */}
              <div className="lc-player-block">
                <div className="lc-player-label lc-label-striker">
                  <FaUser /> Striker
                  <span className="lc-team-tag">Team 1</span>
                </div>
                <select
                  className="lc-select"
                  value={strikerId}
                  onChange={e => setStrikerId(e.target.value)}
                >
                  <option value="">— Select Striker —</option>
                  {team1Players.map(p => (
                    <option key={p._id} value={p._id}>
                      {p.playerName}{p.jerseyNumber ? ` #${p.jerseyNumber}` : ''}
                    </option>
                  ))}
                </select>
                <button
                  className="lc-set-btn lc-set-striker"
                  onClick={() => setPlayerRole('striker', strikerId)}
                  disabled={!strikerId}
                >
                  Set Striker
                </button>
              </div>

              {/* Non-Striker */}
              <div className="lc-player-block">
                <div className="lc-player-label lc-label-nonstriker">
                  <FaUser /> Non-Striker
                </div>
                <select
                  className="lc-select"
                  value={nonStrikerId}
                  onChange={e => setNonStrikerId(e.target.value)}
                >
                  <option value="">— Select Non-Striker —</option>
                  {team1Players.map(p => (
                    <option key={p._id} value={p._id}>
                      {p.playerName}{p.jerseyNumber ? ` #${p.jerseyNumber}` : ''}
                    </option>
                  ))}
                </select>
                <button
                  className="lc-set-btn lc-set-nonstriker"
                  onClick={() => setPlayerRole('non-striker', nonStrikerId)}
                  disabled={!nonStrikerId}
                >
                  Set Non-Striker
                </button>
              </div>

              {/* Bowler */}
              <div className="lc-player-block">
                <div className="lc-player-label lc-label-bowler">
                  <FaBowlingBall /> Bowler
                  <span className="lc-team-tag lc-team-tag-2">Team 2</span>
                </div>
                <select
                  className="lc-select"
                  value={bowlerId}
                  onChange={e => setBowlerId(e.target.value)}
                >
                  <option value="">— Select Bowler —</option>
                  {team2Players.map(p => (
                    <option key={p._id} value={p._id}>
                      {p.playerName}{p.jerseyNumber ? ` #${p.jerseyNumber}` : ''}
                    </option>
                  ))}
                </select>
                <button
                  className="lc-set-btn lc-set-bowler"
                  onClick={() => setPlayerRole('bowler', bowlerId)}
                  disabled={!bowlerId}
                >
                  Set Bowler
                </button>
              </div>
            </div>

            {/* On Field Status */}
            <div className="lc-card lc-onfield-card">
              <div className="lc-section-label">ON FIELD NOW</div>
              <div className="lc-onfield-list">
                <div className="lc-onfield-row lc-onfield-striker">
                  <span className="lc-onfield-role">🏏 Striker</span>
                  <span className="lc-onfield-name">{getPlayerName(strikerId)}</span>
                </div>
                <div className="lc-onfield-row lc-onfield-nonstriker">
                  <span className="lc-onfield-role">⚖ Non-Striker</span>
                  <span className="lc-onfield-name">{getPlayerName(nonStrikerId)}</span>
                </div>
                <div className="lc-onfield-row lc-onfield-bowler">
                  <span className="lc-onfield-role">🎯 Bowler</span>
                  <span className="lc-onfield-name">{getPlayerName(bowlerId)}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

/* ═══════════════════════════════════════════
   STYLES
═══════════════════════════════════════════ */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=Barlow+Condensed:wght@400;600;700;900&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.lc-root {
  min-height: 100vh;
  background: #060b14;
  color: #e2e8f0;
  font-family: 'Syne', sans-serif;
  position: relative;
  overflow-x: hidden;
}

/* Background orbs */
.lc-bg-orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(120px);
  pointer-events: none;
  z-index: 0;
}
.lc-orb-1 {
  width: 600px; height: 600px;
  background: radial-gradient(circle, #0ea5e920 0%, transparent 70%);
  top: -200px; left: -100px;
}
.lc-orb-2 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, #22c55e15 0%, transparent 70%);
  bottom: -100px; right: -100px;
}
.lc-orb-3 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, #f59e0b10 0%, transparent 70%);
  top: 40%; left: 40%;
}

/* ─── HEADER ─── */
.lc-header {
  position: sticky; top: 0; z-index: 100;
  background: rgba(6, 11, 20, 0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.07);
  padding: 0 24px;
}
.lc-header-inner {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 0;
}
.lc-header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}
.lc-back-btn {
  display: flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  color: #94a3b8;
  font-family: 'Syne', sans-serif;
  font-weight: 600;
  font-size: 13px;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.5px;
}
.lc-back-btn:hover {
  background: rgba(255,255,255,0.1);
  color: #e2e8f0;
  transform: translateX(-2px);
}
.lc-back-arrow { font-size: 16px; }

.lc-header-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 28px;
  font-weight: 900;
  letter-spacing: 3px;
  color: #f8fafc;
  text-transform: uppercase;
}
.lc-dot-live {
  width: 10px; height: 10px;
  background: #ef4444;
  border-radius: 50%;
  box-shadow: 0 0 0 3px rgba(239,68,68,0.25);
  animation: lc-pulse 1.2s infinite;
}
@keyframes lc-pulse {
  0%, 100% { box-shadow: 0 0 0 3px rgba(239,68,68,0.25); }
  50% { box-shadow: 0 0 0 6px rgba(239,68,68,0.1); }
}
.lc-match-id {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  color: #475569;
  letter-spacing: 1px;
  margin-top: 4px;
}

.lc-header-score-block {
  text-align: right;
}
.lc-big-score {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 48px;
  font-weight: 900;
  letter-spacing: 2px;
  line-height: 1;
  background: linear-gradient(135deg, #f8fafc, #94a3b8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.lc-overs-label {
  font-size: 14px;
  color: #64748b;
  font-family: 'DM Mono', monospace;
  margin-top: 4px;
}
.lc-status-badge {
  display: inline-block;
  margin-top: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  font-family: 'Barlow Condensed', sans-serif;
}
.lc-badge-live {
  background: rgba(239,68,68,0.15);
  color: #f87171;
  border: 1px solid rgba(239,68,68,0.3);
  animation: lc-fadepulse 2s infinite;
}
.lc-badge-ready {
  background: rgba(100,116,139,0.15);
  color: #94a3b8;
  border: 1px solid rgba(100,116,139,0.3);
}
@keyframes lc-fadepulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* ─── MAIN GRID ─── */
.lc-grid {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px;
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  position: relative;
  z-index: 1;
}
@media (max-width: 1024px) {
  .lc-grid { grid-template-columns: 1fr; }
}

.lc-main, .lc-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ─── CARD ─── */
.lc-card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px;
  padding: 24px;
  backdrop-filter: blur(12px);
  position: relative;
  overflow: hidden;
}
.lc-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%);
  pointer-events: none;
}

.lc-section-label {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 3px;
  color: #475569;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.lc-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.lc-card-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #e2e8f0;
}
.lc-tag {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  color: #64748b;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 999px;
  letter-spacing: 0.5px;
}
.lc-tag-orange { border-color: rgba(245,158,11,0.3); color: #d97706; }

/* ─── BALL STRIP ─── */
.lc-ball-strip-card { padding: 20px 24px; }
.lc-ball-strip {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.lc-ball-dot {
  width: 44px; height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 16px;
  font-weight: 900;
  color: #fff;
  transition: transform 0.2s;
}
.lc-ball-dot:hover { transform: scale(1.1); }

/* ─── RUN GRID ─── */
.lc-run-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  margin-bottom: 12px;
}
@media (max-width: 600px) {
  .lc-run-grid { grid-template-columns: repeat(3, 1fr); }
}

.lc-run-btn {
  aspect-ratio: 1;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: all 0.15s;
  position: relative;
  overflow: hidden;
}
.lc-run-btn:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.04);
  filter: brightness(1.15);
}
.lc-run-btn:active:not(:disabled) { transform: scale(0.96); }
.lc-run-btn:disabled { opacity: 0.35; cursor: not-allowed; }

.lc-run-num {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 32px;
  font-weight: 900;
  line-height: 1;
}
.lc-run-icon {
  font-size: 24px;
  line-height: 1;
}
.lc-run-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  opacity: 0.8;
}

.lc-run-dot {
  background: rgba(71,85,105,0.4);
  border: 2px solid rgba(71,85,105,0.6);
  color: #94a3b8;
}
.lc-run-single {
  background: rgba(16,185,129,0.15);
  border: 2px solid rgba(16,185,129,0.35);
  color: #34d399;
}
.lc-run-four {
  background: rgba(245,158,11,0.2);
  border: 2px solid rgba(245,158,11,0.5);
  color: #fbbf24;
  box-shadow: 0 0 20px rgba(245,158,11,0.15);
}
.lc-run-six {
  background: rgba(239,68,68,0.2);
  border: 2px solid rgba(239,68,68,0.5);
  color: #f87171;
  box-shadow: 0 0 20px rgba(239,68,68,0.15);
  animation: lc-glow 2s infinite alternate;
}
@keyframes lc-glow {
  from { box-shadow: 0 0 10px rgba(239,68,68,0.15); }
  to { box-shadow: 0 0 28px rgba(239,68,68,0.35); }
}

/* ─── EXTRAS GRID ─── */
.lc-extras-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}
@media (max-width: 500px) {
  .lc-extras-grid { grid-template-columns: repeat(2, 1fr); }
}
.lc-extra-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 14px 8px;
  border-radius: 14px;
  border: 2px solid;
  cursor: pointer;
  transition: all 0.15s;
}
.lc-extra-btn:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.2); }
.lc-extra-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.lc-extra-short {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 20px;
  font-weight: 900;
}
.lc-extra-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.lc-extra-wide {
  background: rgba(99,102,241,0.15);
  border-color: rgba(99,102,241,0.35);
  color: #a5b4fc;
}
.lc-extra-noball {
  background: rgba(168,85,247,0.15);
  border-color: rgba(168,85,247,0.35);
  color: #c4b5fd;
}
.lc-extra-bye {
  background: rgba(236,72,153,0.15);
  border-color: rgba(236,72,153,0.35);
  color: #f9a8d4;
}
.lc-extra-wicket {
  background: rgba(239,68,68,0.2);
  border-color: rgba(239,68,68,0.5);
  color: #f87171;
  box-shadow: 0 0 16px rgba(239,68,68,0.2);
}

/* ─── INNINGS CARD ─── */
.lc-innings-num {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 20px;
  color: #64748b;
  margin-bottom: 20px;
  letter-spacing: 1px;
}
.lc-innings-num span {
  font-size: 36px;
  font-weight: 900;
  color: #e2e8f0;
  margin-left: 6px;
}
.lc-ctrl-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.lc-ctrl-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 24px;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
  flex-direction: column;
}
.lc-ctrl-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  filter: brightness(1.1);
}
.lc-ctrl-btn:active:not(:disabled) { transform: scale(0.98); }
.lc-ctrl-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.lc-ctrl-btn svg { font-size: 16px; }
.lc-btn-note {
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.5px;
  margin-top: 4px;
  opacity: 0.7;
  font-family: 'Syne', sans-serif;
}

.lc-btn-init {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  box-shadow: 0 8px 32px rgba(99,102,241,0.35);
}
.lc-btn-start {
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
  box-shadow: 0 8px 32px rgba(16,185,129,0.35);
  flex-direction: row;
}
.lc-btn-end {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #fff;
  box-shadow: 0 8px 24px rgba(239,68,68,0.3);
  flex-direction: row;
}

/* ─── PLAYER SELECTION ─── */
.lc-player-block {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.lc-player-block:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}
.lc-player-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.lc-label-striker { color: #34d399; }
.lc-label-nonstriker { color: #60a5fa; }
.lc-label-bowler { color: #f87171; }
.lc-team-tag {
  margin-left: auto;
  font-size: 9px;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(52,211,153,0.1);
  color: #34d399;
  border: 1px solid rgba(52,211,153,0.25);
  letter-spacing: 0.5px;
}
.lc-team-tag-2 {
  background: rgba(248,113,113,0.1);
  color: #f87171;
  border-color: rgba(248,113,113,0.25);
}
.lc-select {
  width: 100%;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  color: #e2e8f0;
  border-radius: 10px;
  padding: 10px 14px;
  font-family: 'Syne', sans-serif;
  font-size: 14px;
  outline: none;
  cursor: pointer;
  appearance: none;
  margin-bottom: 10px;
  transition: border-color 0.2s;
}
.lc-select:focus { border-color: rgba(99,102,241,0.5); }
.lc-select option { background: #0f172a; }
.lc-set-btn {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  transition: all 0.15s;
}
.lc-set-btn:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.1); }
.lc-set-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.lc-set-striker { background: rgba(52,211,153,0.15); color: #34d399; border: 1px solid rgba(52,211,153,0.3); }
.lc-set-nonstriker { background: rgba(96,165,250,0.15); color: #60a5fa; border: 1px solid rgba(96,165,250,0.3); }
.lc-set-bowler { background: rgba(248,113,113,0.15); color: #f87171; border: 1px solid rgba(248,113,113,0.3); }

/* ─── ON FIELD ─── */
.lc-onfield-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.lc-onfield-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 12px;
}
.lc-onfield-striker {
  background: rgba(52,211,153,0.08);
  border: 1px solid rgba(52,211,153,0.15);
}
.lc-onfield-nonstriker {
  background: rgba(96,165,250,0.08);
  border: 1px solid rgba(96,165,250,0.15);
}
.lc-onfield-bowler {
  background: rgba(248,113,113,0.08);
  border: 1px solid rgba(248,113,113,0.15);
}
.lc-onfield-role {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #64748b;
}
.lc-onfield-name {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #e2e8f0;
  letter-spacing: 0.5px;
}

/* ─── LOADING ─── */
.lc-loading {
  min-height: 100vh;
  background: #060b14;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lc-loading-inner {
  text-align: center;
}
.lc-spinner {
  width: 56px; height: 56px;
  border: 3px solid rgba(255,255,255,0.05);
  border-top-color: #10b981;
  border-radius: 50%;
  animation: lc-spin 0.8s linear infinite;
  margin: 0 auto 24px;
}
@keyframes lc-spin { to { transform: rotate(360deg); } }
.lc-loading-text {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 24px;
  font-weight: 900;
  letter-spacing: 4px;
  color: #e2e8f0;
  margin-bottom: 8px;
}
.lc-loading-sub {
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  color: #475569;
  letter-spacing: 1px;
}
`;

export default LiveControl;