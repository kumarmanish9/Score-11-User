import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMatchDetails, updateToss, startMatch } from '../Services/matchService';
import { getTeamById } from '../Services/teamService';
import "../assets/Styles/Global.css";

/* ─── Inline styles ─────────────────────────────────────────────── */
const S = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #eff6ff 0%, #eef2ff 100%)',
    padding: '2rem 1rem',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  container: { maxWidth: 720, margin: '0 auto' },
  card: {
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 4px 32px rgba(30,64,175,.12)',
    overflow: 'hidden',
  },
  header: {
    background: 'linear-gradient(135deg, #1a56db 0%, #1e40af 100%)',
    color: '#fff',
    textAlign: 'center',
    padding: '1.75rem 1rem',
  },
  headerTitle: { fontSize: 26, fontWeight: 700, marginBottom: 6, letterSpacing: '-0.5px' },
  headerSub: { fontSize: 14, opacity: 0.85, margin: 0 },
  body: { padding: '2rem 1.5rem' },
  /* Teams */
  teamsRow: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.75rem',
  },
  teamCard: (selected) => ({
    textAlign: 'center',
    background: selected ? '#EFF6FF' : '#f8fafc',
    border: `2px solid ${selected ? '#1a56db' : '#e2e8f0'}`,
    borderRadius: 12,
    padding: '1rem .75rem',
    cursor: 'pointer',
    transition: 'all .2s',
  }),
  teamLogo: {
    width: 64, height: 64, borderRadius: '50%',
    objectFit: 'cover', margin: '0 auto .5rem', display: 'block',
    border: '2px solid #e2e8f0', background: '#f1f5f9',
  },
  teamName: (selected) => ({
    fontSize: 14, fontWeight: 600,
    color: selected ? '#1e40af' : '#1e293b',
    marginTop: 4,
  }),
  vsBadge: {
    fontSize: 18, fontWeight: 700, color: '#94a3b8', textAlign: 'center',
  },
  /* Coin */
  coinArea: { textAlign: 'center', margin: '1rem 0 1.75rem' },
  coinScene: { width: 120, height: 120, margin: '0 auto 1rem', perspective: 400 },
  /* Controls */
  controlsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  sectionLabel: {
    fontSize: 13, fontWeight: 600, color: '#64748b',
    marginBottom: '.6rem', paddingBottom: '.4rem',
    borderBottom: '1px solid #e2e8f0',
  },
  optBtn: (active, disabled) => ({
    display: 'block', width: '100%',
    background: active ? '#1a56db' : '#f8fafc',
    color: active ? '#fff' : '#334155',
    border: `1.5px solid ${active ? '#1a56db' : '#e2e8f0'}`,
    borderRadius: 10, padding: '.65rem .75rem',
    fontSize: 13, fontWeight: 500, cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1, marginBottom: '.5rem',
    transition: 'all .15s', textAlign: 'left',
  }),
  submitBtn: (disabled) => ({
    width: '100%', background: disabled ? '#e2e8f0' : '#16a34a',
    color: disabled ? '#94a3b8' : '#fff',
    border: 'none', borderRadius: 10,
    padding: '.9rem', fontSize: 15, fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer', transition: 'background .2s',
  }),
  flipBtn: (disabled) => ({
    background: disabled ? '#e2e8f0' : '#1a56db',
    color: disabled ? '#94a3b8' : '#fff',
    border: 'none', borderRadius: 8,
    padding: '.55rem 1.4rem', fontSize: 14, fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer', transition: 'background .2s',
  }),
  resultBadge: {
    display: 'inline-block', marginTop: '.5rem',
    padding: '.25rem .85rem', borderRadius: 8,
    fontSize: 13, fontWeight: 700,
    background: '#dcfce7', color: '#15803d',
    letterSpacing: 1,
  },
  errorBox: {
    background: '#fef2f2', border: '1px solid #fca5a5',
    borderRadius: 10, padding: '.65rem .9rem',
    fontSize: 13, color: '#b91c1c', marginBottom: '1rem',
  },
  successBox: { textAlign: 'center', padding: '2.5rem 1rem' },
  successIcon: { fontSize: 52, marginBottom: '.75rem' },
  successTitle: { fontSize: 22, fontWeight: 700, color: '#15803d', marginBottom: '.5rem' },
  successDesc: { fontSize: 14, color: '#475569', marginBottom: '1.5rem', lineHeight: 1.6 },
  proceedBtn: {
    background: '#16a34a', color: '#fff', border: 'none',
    borderRadius: 10, padding: '.8rem 2rem',
    fontSize: 15, fontWeight: 600, cursor: 'pointer',
  },
  footer: {
    borderTop: '1px solid #f1f5f9',
    padding: '.9rem', textAlign: 'center',
  },
  backBtn: {
    background: 'transparent', border: '1px solid #e2e8f0',
    borderRadius: 8, padding: '.4rem 1.1rem',
    fontSize: 13, cursor: 'pointer', color: '#64748b',
  },
  spinnerInline: {
    width: 14, height: 14,
    border: '2px solid rgba(255,255,255,.3)',
    borderTopColor: '#fff', borderRadius: '50%',
    display: 'inline-block', verticalAlign: 'middle',
    marginRight: 8, animation: 'spin .6s linear infinite',
  },
};

/* ─── Keyframe injection ─────────────────────────────────────────── */
const injectKeyframes = () => {
  if (document.getElementById('toss-kf')) return;
  const style = document.createElement('style');
  style.id = 'toss-kf';
  style.textContent = `
    @keyframes spin { from{transform:rotateY(0deg)} to{transform:rotateY(360deg)} }
    @keyframes landHeads { 0%{transform:rotateY(1440deg)} 100%{transform:rotateY(0deg)} }
    @keyframes landTails { 0%{transform:rotateY(1440deg)} 100%{transform:rotateY(180deg)} }
    @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
    @media(max-width:520px){
      .toss-controls-grid{grid-template-columns:1fr!important}
    }
  `;
  document.head.appendChild(style);
};

/* ─── Web Audio sound effects ────────────────────────────────────── */
const playSound = (type) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (type === 'flip') {
      for (let i = 0; i < 8; i++) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.connect(g); g.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300 + i * 90, ctx.currentTime + i * 0.08);
        g.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.1);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.12);
      }
    } else if (type === 'land') {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g); g.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(700, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.35);
      g.gain.setValueAtTime(0.35, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } else if (type === 'success') {
      [523, 659, 784, 1047].forEach((f, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.connect(g); g.connect(ctx.destination);
        osc.type = 'sine'; osc.frequency.value = f;
        g.gain.setValueAtTime(0.18, ctx.currentTime + i * 0.13);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.13 + 0.22);
        osc.start(ctx.currentTime + i * 0.13);
        osc.stop(ctx.currentTime + i * 0.13 + 0.25);
      });
    }
  } catch (_) {}
};

/* ─── Coin component ─────────────────────────────────────────────── */
const Coin = ({ animClass }) => {
  const coinStyle = {
    width: 120, height: 120, position: 'relative',
    transformStyle: 'preserve-3d',
    animation: animClass === 'spinning'
      ? 'spin 0.1s linear infinite'
      : animClass === 'land-heads'
        ? 'landHeads .65s ease-out forwards'
        : animClass === 'land-tails'
          ? 'landTails .65s ease-out forwards'
          : 'none',
  };
  const faceBase = {
    width: 120, height: 120, borderRadius: '50%',
    position: 'absolute', backfaceVisibility: 'hidden',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 42, border: '4px solid #c8a000',
    boxShadow: '0 0 0 2px #ffd700, inset 0 0 16px rgba(0,0,0,.12)',
  };
  return (
    <div style={coinStyle}>
      <div style={{
        ...faceBase,
        background: 'radial-gradient(circle at 35% 35%, #ffe066, #f5b800, #c8a000)',
        transform: 'rotateY(0deg)',
      }}>🏏</div>
      <div style={{
        ...faceBase,
        background: 'radial-gradient(circle at 35% 35%, #e8d5a3, #c8a000, #9a7800)',
        transform: 'rotateY(180deg)',
      }}>🏆</div>
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────── */
const TossScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tossData, setTossData] = useState({ winner: null, decision: null });
  const [tossDone, setTossDone] = useState(false);
  const [team1, setTeam1] = useState(null);
  const [team2, setTeam2] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [coinAnim, setCoinAnim] = useState('idle'); // idle | spinning | land-heads | land-tails
  const [coinResult, setCoinResult] = useState(null); // 'HEADS' | 'TAILS'
  const [coinFlipped, setCoinFlipped] = useState(false);

  useEffect(() => { injectKeyframes(); }, []);
  useEffect(() => { if (id) fetchMatch(); }, [id]);

  const fetchMatch = async () => {
    try {
      setLoading(true);
      const matchData = await getMatchDetails(id);
      setMatch(matchData);
      if (matchData.toss) {
        setTossData({
          winner: matchData.toss.winner?._id || matchData.toss.winner,
          decision: matchData.toss.decision,
        });
        setTossDone(true);
        setCoinFlipped(true);
      }
      if (matchData.team1?._id) setTeam1(await getTeamById(matchData.team1._id));
      if (matchData.team2?._id) setTeam2(await getTeamById(matchData.team2._id));
      setError('');
    } catch (err) {
      console.error(err);
      setError('Match not found or access denied');
      navigate('/scheduled-matches');
    } finally {
      setLoading(false);
    }
  };

  /* Coin flip */
  const handleFlipCoin = () => {
    if (coinFlipped || coinAnim !== 'idle') return;
    setError('');
    setCoinResult(null);
    setCoinAnim('spinning');
    playSound('flip');
    const spinDuration = 1800 + Math.random() * 800;
    const isHeads = Math.random() > 0.5;
    setTimeout(() => {
      setCoinAnim(isHeads ? 'land-heads' : 'land-tails');
      playSound('land');
      setTimeout(() => {
        setCoinResult(isHeads ? 'HEADS' : 'TAILS');
        setCoinFlipped(true);
      }, 700);
    }, spinDuration);
  };

  /* Winner / Decision */
  const selectWinner = (winnerId) => {
    if (!coinFlipped) { setError('Pehle coin flip karo!'); return; }
    setTossData(prev => ({ ...prev, winner: winnerId }));
    setError('');
  };
  const selectDecision = (d) => {
    setTossData(prev => ({ ...prev, decision: d }));
    setError('');
  };

  /* Submit */
  const handleTossSubmit = async () => {
    if (tossDone || match?.toss) {
      navigate(`/match/${id}/team-select`);
      return;
    }
    if (!tossData.winner) return setError('Toss winner select karo');
    if (!tossData.decision) return setError('Decision select karo');

    setSubmitting(true);
    setError('');
    try {
      await updateToss(id, tossData);
      playSound('success');
      
      // 🔥 AUTO-START MATCH after toss
      await startMatch(id);
      
      await fetchMatch();
      setTossDone(true);
      
      // 👉 NEW: Go to lineup page instead of team-select
      setTimeout(() => navigate(`/match/${id}/lineup`), 1800);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Toss update failed');
    } finally {
      setSubmitting(false);
    }
  };

  /* Loading */
  if (loading) return (
    <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 48, height: 48, border: '4px solid #dbeafe',
          borderTopColor: '#1a56db', borderRadius: '50%',
          animation: 'spin .8s linear infinite', margin: '0 auto 1rem',
        }} />
        <p style={{ color: '#64748b', fontSize: 14 }}>Match load ho raha hai...</p>
      </div>
    </div>
  );

  /* Error state */
  if (!match) return (
    <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: '.75rem' }}>❌</div>
        <h3 style={{ color: '#b91c1c', marginBottom: '.5rem' }}>Error</h3>
        <p style={{ color: '#64748b', fontSize: 14, marginBottom: '1rem' }}>{error || 'Match nahi mila'}</p>
        <button style={S.proceedBtn} onClick={() => navigate('/scheduled-matches')}>
          ← Back to Matches
        </button>
      </div>
    </div>
  );

  const team1Name = team1?.name || match.team1?.name || 'Team 1';
  const team2Name = team2?.name || match.team2?.name || 'Team 2';
  const team1Id = match.team1?._id;
  const team2Id = match.team2?._id;
  const team1Logo = team1?.logo?.url;
  const team2Logo = team2?.logo?.url;

  const getDefaultLogo = (name, color = '#1a56db') =>
    `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><circle cx="30" cy="30" r="30" fill="${encodeURIComponent(color)}"/><text x="30" y="36" text-anchor="middle" font-size="16" font-weight="bold" fill="white">${encodeURIComponent(name.substring(0, 2).toUpperCase())}</text></svg>`;

  const winnerName = tossData.winner === team1Id ? team1Name : tossData.winner === team2Id ? team2Name : '';

  return (
    <div style={S.page}>
      <div style={S.container}>
        <div style={S.card}>

          {/* Header */}
          <div style={S.header}>
            <div style={S.headerTitle}>🪙 Toss Time!</div>
            <p style={S.headerSub}>
              {team1Name} vs {team2Name} &nbsp;|&nbsp;{' '}
              {match.format?.toUpperCase()} &nbsp;|&nbsp; {match.overs} overs
            </p>
          </div>

          <div style={S.body}>
            {/* Error */}
            {error && <div style={S.errorBox}>⚠️ {error}</div>}

            {/* Toss Done View */}
            {tossDone && match.toss ? (
              <div style={S.successBox}>
                <div style={S.successIcon}>✅</div>
                <div style={S.successTitle}>Toss Complete!</div>
                <div style={S.successDesc}>
                  <strong>
                    {match.toss.winner?.name || (match.toss.winner === team1Id ? team1Name : team2Name)}
                  </strong>{' '}
                  ne toss jeeta aur{' '}
                  <strong>{match.toss.decision?.toUpperCase()}</strong> first choose kiya.
                </div>
                <button style={S.proceedBtn} onClick={() => navigate(`/match/${id}/team-select`)}>
                  🚀 Team Selection
                </button>
              </div>
            ) : (
              <>
                {/* Teams Row */}
                <div style={S.teamsRow}>
                  <div
                    style={S.teamCard(tossData.winner === team1Id)}
                    onClick={() => selectWinner(team1Id)}
                  >
                    <img
                      src={team1Logo || getDefaultLogo(team1Name, '#1a56db')}
                      alt={team1Name}
                      style={S.teamLogo}
                      onError={e => { e.target.src = getDefaultLogo(team1Name, '#1a56db'); }}
                    />
                    <div style={S.teamName(tossData.winner === team1Id)}>{team1Name}</div>
                    {tossData.winner === team1Id && (
                      <div style={{ fontSize: 11, color: '#1e40af', marginTop: 4, fontWeight: 600 }}>
                        ✔ Wins Toss
                      </div>
                    )}
                  </div>

                  <div style={S.vsBadge}>VS</div>

                  <div
                    style={S.teamCard(tossData.winner === team2Id)}
                    onClick={() => selectWinner(team2Id)}
                  >
                    <img
                      src={team2Logo || getDefaultLogo(team2Name, '#ca8a04')}
                      alt={team2Name}
                      style={S.teamLogo}
                      onError={e => { e.target.src = getDefaultLogo(team2Name, '#ca8a04'); }}
                    />
                    <div style={S.teamName(tossData.winner === team2Id)}>{team2Name}</div>
                    {tossData.winner === team2Id && (
                      <div style={{ fontSize: 11, color: '#1e40af', marginTop: 4, fontWeight: 600 }}>
                        ✔ Wins Toss
                      </div>
                    )}
                  </div>
                </div>

                {/* Coin */}
                <div style={S.coinArea}>
                  <div style={S.coinScene}>
                    <Coin animClass={coinAnim} />
                  </div>
                  {coinResult && (
                    <div style={S.resultBadge}>
                      {coinResult === 'HEADS' ? '🏏' : '🏆'} {coinResult}
                    </div>
                  )}
                  <div style={{ marginTop: '.85rem' }}>
                    <button
                      style={S.flipBtn(coinFlipped || coinAnim !== 'idle')}
                      onClick={handleFlipCoin}
                      disabled={coinFlipped || coinAnim !== 'idle'}
                    >
                      {coinAnim === 'spinning' ? '🪙 Flipping...' : coinFlipped ? '✔ Coin Flipped' : '🪙 Flip Coin'}
                    </button>
                  </div>
                  {!coinFlipped && (
                    <p style={{ fontSize: 12, color: '#94a3b8', marginTop: '.5rem' }}>
                      Coin flip karo, phir winner aur decision choose karo
                    </p>
                  )}
                </div>

                {/* Controls */}
                <div style={S.controlsGrid} className="toss-controls-grid">
                  <div>
                    <div style={S.sectionLabel}>🏆 Toss Winner</div>
                    <button
                      style={S.optBtn(tossData.winner === team1Id, !coinFlipped)}
                      onClick={() => selectWinner(team1Id)}
                      disabled={!coinFlipped}
                    >
                      {team1Name} Wins
                    </button>
                    <button
                      style={S.optBtn(tossData.winner === team2Id, !coinFlipped)}
                      onClick={() => selectWinner(team2Id)}
                      disabled={!coinFlipped}
                    >
                      {team2Name} Wins
                    </button>
                  </div>
                  <div>
                    <div style={S.sectionLabel}>⚡ Decision</div>
                    <button
                      style={S.optBtn(tossData.decision === 'bat', !tossData.winner)}
                      onClick={() => selectDecision('bat')}
                      disabled={!tossData.winner}
                    >
                      🏏 Bat First
                    </button>
                    <button
                      style={S.optBtn(tossData.decision === 'bowl', !tossData.winner)}
                      onClick={() => selectDecision('bowl')}
                      disabled={!tossData.winner}
                    >
                      🎯 Bowl First
                    </button>
                  </div>
                </div>

                {/* Summary line */}
                {tossData.winner && tossData.decision && (
                  <div style={{
                    background: '#f0fdf4', border: '1px solid #bbf7d0',
                    borderRadius: 10, padding: '.65rem .9rem',
                    fontSize: 13, color: '#15803d', marginBottom: '1rem',
                    textAlign: 'center', fontWeight: 500,
                  }}>
                    {winnerName} ne toss jeeta → {tossData.decision === 'bat' ? 'Batting' : 'Bowling'} first
                  </div>
                )}

                {/* Submit */}
                <button
                  style={S.submitBtn(!tossData.winner || !tossData.decision || submitting)}
                  onClick={handleTossSubmit}
                  disabled={!tossData.winner || !tossData.decision || submitting}
                >
                  {submitting
                    ? <><span style={S.spinnerInline} />Completing Toss...</>
                    : '🚀 Complete Toss'
                  }
                </button>
              </>
            )}
          </div>

          {/* Footer */}
          {!tossDone && (
            <div style={S.footer}>
              <button
                style={S.backBtn}
                onClick={() => navigate('/scheduled-matches')}
                disabled={submitting}
              >
                ← Back to Scheduled Matches
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TossScreen;