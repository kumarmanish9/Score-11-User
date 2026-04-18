import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getMatchDetails, getLiveScore, addBall, setStriker, setNonStriker, setBowler,
  startInnings, endInnings, initMatchSocket, joinMatchRoom, leaveMatchRoom
} from '../Services/matchService';
import { getTeamById } from '../Services/teamService';
import { useLiveScore } from '../hooks/useLiveScore';
import './LiveControl.css';
import '../assets/Styles/Global.css';

const CompleteLiveControl = () => {
  const { id } = useParams();
  const navigate = useNavigate();

const { liveData, loading: scoreLoading, error: scoreError, refetch } = useLiveScore(id);
  
  // Match data
  const [match, setMatch] = useState(null);

  // Wagon wheel shots
  const [shots, setShots] = useState([]);

  // UI state
  const [filter, setFilter] = useState('all');
  const [pickedRun, setPickedRun] = useState(null);
  const [pickedExtra, setPickedExtra] = useState(null);
  const [pendingShot, setPendingShot] = useState({ x: null, y: null });
  const [scTab, setScTab] = useState('bat');

  const canvasRef = useRef(null);

  // Load match data
  const loadMatch = useCallback(async () => {
    try {
      const matchData = await getMatchDetails(id);
      setMatch(matchData);
    } catch (err) {
      console.error('Load error:', err);
    }
  }, [id]);

  // Update shots from live data (simulate wagon wheel x,y for now)
  useEffect(() => {
    if (liveData?.recentBalls) {
      setShots(liveData.recentBalls.slice(-20).map((ball, index) => ({
        x: 0.3 + (index % 3) * 0.2,
        y: 0.4 + Math.sin(index) * 0.2,
        run: ball.runs || 0,
        batter: ball.batsman?._id || 'unknown'
      })));
    }
  }, [liveData]);

  useEffect(() => {
    loadMatch();
  }, [loadMatch]);
  
  // ════ WAGON WHEEL ════
  const drawField = useCallback((ctx, width, height) => {
    if (width <= 0 || height <= 0) return;
    const CX = width / 2, CY = height / 2, R = Math.max(10, Math.min(width, height) / 2 - 20);
    
    // White theme grass (light green)
    ctx.clearRect(0, 0, width, height);
    
    // Boundary + field (white theme)
    const outerGrad = ctx.createRadialGradient(CX, CY, 0, CX, CY, R);
    outerGrad.addColorStop(0, '#e8f5e8');      // Light green
    outerGrad.addColorStop(0.5, '#d4ead4'); 
    outerGrad.addColorStop(1, '#c8e6c8');
    ctx.beginPath(); ctx.ellipse(CX, CY, R, R * 0.97, 0, 0, Math.PI * 2);
    ctx.fillStyle = outerGrad; ctx.fill();
    
    // Boundary rope (dark green)
    ctx.strokeStyle = '#4a8a4a'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(CX, CY, R - 5, 0, Math.PI * 2); ctx.stroke();
    
    // Pitch (light brown)
    const pitchW = width * 0.08, pitchH = width * 0.35;
    ctx.save(); ctx.translate(CX, CY);
    const pg = ctx.createLinearGradient(-pitchW/2, 0, pitchW/2, 0);
    pg.addColorStop(0, '#f0d4b0'); pg.addColorStop(0.5, '#f5e0c0'); pg.addColorStop(1, '#e8c8a0');
    ctx.fillStyle = pg;
    ctx.fillRect(-pitchW/2, -pitchH/2, pitchW, pitchH);
    ctx.restore();
    
    // Draw shots
    shots.filter(s => filter === 'all' || s.run == filter || s.batter === filter).forEach(s => {
      const sx = s.x * width, sy = s.y * height;
      const col = s.run === 4 ? '#ffaa00' : s.run === 6 ? '#00cc88' : 
                  s.run === 0 ? '#666' : s.run === 'W' ? '#ff4444' : '#888';
      
      // Shot line
      ctx.strokeStyle = col + '88'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(CX, CY); ctx.lineTo(sx, sy); ctx.stroke();
      
      // Shot dot
      ctx.beginPath(); ctx.arc(sx, sy, 8, 0, Math.PI * 2);
      ctx.fillStyle = col; ctx.fill();
    });
    
    // Pending shot preview
    if (pendingShot.x) {
      ctx.strokeStyle = '#ffaa00'; ctx.setLineDash([8, 8]); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(CX, CY); 
      ctx.lineTo(pendingShot.x, pendingShot.y); ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [shots, filter, pendingShot]);
  
  // Canvas click handler
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) * canvas.width) / rect.width;
    const y = ((e.clientY - rect.top) * canvas.height) / rect.height;
    
    const dist = Math.sqrt((x - canvas.width/2)**2 + (y - canvas.height/2)**2);
    if (dist > Math.min(canvas.width, canvas.height)/2) return;
    
    setPendingShot({ x, y });
  };
  
  // Quick shot handlers (Backend integration)
  const commitShot = async () => {
    if (!pickedRun || !pendingShot.x) return;
    
    const shotData = {
      matchId: id,
      batsman: currentBatter,
      bowler: currentBowler.id || currentBowler._id,
      runs: pickedRun,
      extras: pickedExtra || null,
      x: pendingShot.x / canvasRef.current.width,
      y: pendingShot.y / canvasRef.current.height
    };
    
    try {
      await addBall(id, shotData);
      setPickedRun(null);
      setPendingShot({ x: null, y: null });
      // Clear buttons
      document.querySelectorAll('.rpill, .epill').forEach(el => el.classList.remove('sel', 'active'));
    } catch (err) {
      console.error('Shot error:', err);
    }
  };
  
  const pickRunHandler = (r, e) => {
    setPickedRun(r);
    document.querySelectorAll('.rpill').forEach(el => el.classList.remove('sel'));
    e.currentTarget.classList.add('sel');
  };
  
  const pickExtraHandler = (ex, e) => {
    setPickedExtra(prev => prev === ex ? null : ex);
    e.currentTarget.classList.toggle('active');
  };
  
  // Player controls (Backend)
  const setStrikerHandler = async (batterId) => {
    await setStriker(id, batterId);
    setCurrentBatter(batterId);
  };
  
  // Filter tabs
  const setFilterHandler = (f, e) => {
    setFilter(f);
    document.querySelectorAll('.ftab').forEach(el => el.classList.remove('active'));
    e.currentTarget.classList.add('active');
  };
  
  // Scorecard tabs
  const setScTabHandler = (t, e) => {
    setScTab(t);
    document.querySelectorAll('.sc-tab').forEach(el => el.classList.remove('active'));
    e.currentTarget.classList.add('active');
  };
  
  // Canvas resize observer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resizeObserver = new ResizeObserver(() => {
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      drawField(ctx, rect.width, rect.height);
    });
    resizeObserver.observe(canvas);
    
    return () => resizeObserver.disconnect();
  }, [drawField]);
  
  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    drawField(ctx, rect.width, rect.height);
  }, [drawField]);
  
  return (
    <div className="complete-live-control">
      {/* HEADER */}
      <header className="live-header">
        <div className="logo">CRICK<em>LIVE</em></div>
        <div className="hdr-score">
          <div className="hdr-team hdr-bat">
            <span className="hdr-flag">🇮🇳</span>
    <span className="hdr-name">{liveData?.match?.team1?.name || 'Team 1'}</span>
            <span className="hdr-runs">{liveData?.score?.team1?.runs || 0}/{liveData?.score?.team1?.wickets || 0}</span>
            <span>({liveData?.scorecard?.overs || '0.0'})</span>
          </div>
          <div className="hdr-vs">VS</div>
          <div className="hdr-team">
            <span className="hdr-runs" style={{color: '#ffaa00'}}>{liveData?.score?.team2?.runs || 0}/{liveData?.score?.team2?.wickets || 0}</span>
            <span className="hdr-name">{liveData?.match?.team2?.name || 'Team 2'}</span>
            <span className="hdr-flag">🇦🇺</span>
          </div>
        </div>
        <div className="hdr-meta">
          <div className="crr-chip">
            <div className="lbl">CRR</div>
            <div className="val">{liveData?.scorecard?.runRate?.toFixed(2) || '0.00'}</div>
          </div>
          <div className="live-badge">
            <div className="live-dot"></div><span>LIVE</span>
          </div>
          <div className="rrr-chip">
            <div className="lbl">RRR</div>
            <div className="val">{liveData?.requiredRunRate || '0.00'}</div>
          </div>
        </div>
      </header>
      
      <div className="app-body">
        {/* LEFT PANEL - BATTERS & OVER */}
        <div className="left-panel">
          <div className="pnl-head">
            BATTING <span>3rd ODI · Ongoing</span>
          </div>
          
          {/* Batter Cards */}
          <div className={`batter-card ${currentBatter === 'kohli' ? 'active-batter' : ''}`}
               onClick={() => setCurrentBatter('kohli')}>
            <div className="bc-top">
              <div>V. Kohli <span className="strike-tag">★ STRIKE</span></div>
              <div className="bc-runs">{batters.kohli.runs}</div>
            </div>
            <div className="bc-sub">
              <span className="bc-detail">{batters.kohli.balls}b · {batters.kohli.fours}×4 · {batters.kohli.sixes}×6</span>
              <span className="bc-sr">SR {batters.kohli.sr}</span>
            </div>
          </div>
          
          {/* Partnership */}
          <div className="part-strip">
            <div className="part-label">Partnership</div>
            <div className="part-nums">
              <span>Runs <strong>{partnership.runs}</strong></span>
              <span>Balls <strong>{partnership.balls}</strong></span>
              <span>RR <strong>{partnership.rr}</strong></span>
            </div>
            <div className="part-bar-bg">
              <div className="part-bar-fill" style={{width: '65%'}}></div>
            </div>
          </div>
          
          {/* Bowler */}
          <div className="bowler-strip">
            <div className="pnl-head" style={{padding: '0 0 6px'}}>BOWLING</div>
            <div className="bowler-row">
              <span className="bowler-name">{currentBowler.name} ★</span>
              <span className="bowler-fig">{currentBowler.figures}</span>
            </div>
          </div>
          
          {/* Current Over */}
          <div className="over-strip">
            <div className="pnl-head">
              <span>CURRENT OVER {currentOver.number}</span>
              <span style={{color: '#333'}}>{currentOver.runs} runs</span>
            </div>
            <div className="over-balls-row">
              {currentOver.balls.map((ball, i) => (
                <div key={i} className={`oball ${ball.type || 'dot'}`}>
                  {ball.runs || '·'}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* MIDDLE - FIELD */}
        <div className="field-wrap">
          <div className="field-top-bar">
            <span className="ftb-title">⚾ Wagon Wheel · Click Field to Place Shot</span>
            <div className="filter-tabs">
              <button className="ftab active" onClick={(e) => setFilterHandler('all', e)}>ALL</button>
              <button className="ftab" onClick={(e) => setFilterHandler('4', e)}>4s</button>
              <button className="ftab" onClick={(e) => setFilterHandler('6', e)}>6s</button>
            </div>
          </div>
          
          <div className="field-canvas-outer">
            <canvas 
              ref={canvasRef}
              id="fieldCanvas"
              onClick={handleCanvasClick}
              style={{cursor: 'crosshair'}}
            />
          </div>
          
          {/* Shot Controls */}
          <div className="shot-ctrl-bar">
            <div className="ctrl-group">
              <span className="ctrl-label">Runs</span>
              <div className="run-pills">
                <button className="rpill" data-r="0" onClick={(e) => pickRunHandler(0, e)}>•</button>
                <button className="rpill" data-r="1" onClick={(e) => pickRunHandler(1, e)}>1</button>
                <button className="rpill" data-r="2" onClick={(e) => pickRunHandler(2, e)}>2</button>
                <button className="rpill" data-r="4" onClick={(e) => pickRunHandler(4, e)}>4</button>
                <button className="rpill" data-r="6" onClick={(e) => pickRunHandler(6, e)}>6</button>
                <button className="rpill" data-r="W" onClick={(e) => pickRunHandler('W', e)}>OUT</button>
              </div>
            </div>
            <div className="ctrl-group">
              <span className="ctrl-label">Extra</span>
              <div className="extra-pills">
                <button className="epill" onClick={(e) => pickExtraHandler('WD', e)}>WD</button>
                <button className="epill" onClick={(e) => pickExtraHandler('NB', e)}>NB</button>
              </div>
            </div>
            <div className="ctrl-actions">
              <button className={`btn-add ${pickedRun && pendingShot.x ? '' : 'disabled'}`} 
                      onClick={commitShot}>+ ADD SHOT</button>
              <button className="btn-undo" onClick={() => {/* Undo logic */}}>
                ↩ UNDO
              </button>
            </div>
          </div>
          
          <div className="zone-legend">
            <div className="zl-item"><div className="zl-dot" style={{background: '#ffaa00'}}></div>Four</div>
            <div className="zl-item"><div className="zl-dot" style={{background: '#00cc88'}}></div>Six</div>
            <div className="zl-item"><div className="zl-dot" style={{background: '#fff'}}></div>1·2</div>
            <span style={{marginLeft: 'auto'}}>
              {shots.length} shots · {shots.filter(s=>s.run===4).length}×4 · {shots.filter(s=>s.run===6).length}×6
            </span>
          </div>
        </div>
        
        {/* RIGHT PANEL - SCORECARD */}
        <div className="right-panel">
          <div className="sc-tabs">
            <button className={`sc-tab ${scTab === 'bat' ? 'active' : ''}`} 
                    onClick={(e) => setScTabHandler('bat', e)}>BATTING</button>
            <button className={`sc-tab ${scTab === 'bowl' ? 'active' : ''}`} 
                    onClick={(e) => setScTabHandler('bowl', e)}>BOWLING</button>
            <button className={`sc-tab ${scTab === 'comm' ? 'active' : ''}`} 
                    onClick={(e) => setScTabHandler('comm', e)}>BALL×BALL</button>
          </div>
          
          {scTab === 'bat' && (
            <div className="sc-table-container">
              <table className="sc-table">
                <thead>
                  <tr><th>Batter</th><th>R</th><th>B</th><th>4s</th><th>6s</th><th>SR</th></tr>
                </thead>
                <tbody>
                  <tr><td>R. Sharma c Maxwell b Cummins</td><td>12</td><td>15</td><td>2</td><td>0</td><td>80.0</td></tr>
                  <tr className="sc-hi"><td><strong>V. Kohli ★</strong></td><td>{batters.kohli.runs}</td><td>{batters.kohli.balls}</td><td>{batters.kohli.fours}</td><td>{batters.kohli.sixes}</td><td>{batters.kohli.sr}</td></tr>
                </tbody>
              </table>
            </div>
          )}
          
          {scTab === 'comm' && (
            <div className="comm-list">
              {commentary.map((c, i) => (
                <div key={i} className={`comm-item ${c.type || ''}`}>
                  <span className="comm-over">{c.over}</span>
                  <div>
                    <div className="comm-text">{c.text}</div>
                    {c.badge && <span className={`comm-badge ${c.type}`}>{c.badge}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompleteLiveControl;

