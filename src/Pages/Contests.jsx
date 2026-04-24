import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getContests } from '../Services/contestService';

function Contests() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => { fetchContests(); }, []);

  const fetchContests = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getContests();
      setContests(data.slice(0, 12));
    } catch (err) {
      setError('Failed to load contests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fillPct = (c) => Math.min(100, Math.round(((c.joinedSpots || 0) / c.totalSpots) * 100));

  const getTag = (c) => {
    const pct = fillPct(c);
    if (pct >= 90) return { label: 'FILLING FAST', bg: '#ffeaec', color: '#e63946' };
    if ((c.entryFee || 0) === 0) return { label: 'FREE', bg: '#dcfce7', color: '#16a34a' };
    return { label: 'OPEN', bg: '#eff6ff', color: '#2563eb' };
  };

  /* ── Loading ── */
  if (loading) return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Mulish:wght@400;500;600;700&display=swap');`}</style>
      <div style={{ fontFamily: "'Mulish', sans-serif", minHeight: '100vh', background: '#f7f7f5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
        <div style={{ width: 36, height: 36, border: '3px solid #e8e8e8', borderTop: '3px solid #e63946', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', color: '#bbb' }}>LOADING CONTESTS</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Mulish:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes barFill { from{width:0} to{width:var(--w)} }
        .ct-root { font-family: 'Mulish', sans-serif; background: #f7f7f5; min-height: 100vh; padding: 52px 20px 80px; color: #111; }
        .ct-join-btn:hover { background: #e63946 !important; transform: translateY(-1px); }
        .ct-retry:hover { background: #111 !important; color: #fff !important; }
        .ct-view-all:hover { background: #111 !important; color: #fff !important; border-color: #111 !important; }
      `}</style>

      <div className="ct-root">
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>

          {/* ── Header ── */}
          <div style={{ marginBottom: 44, animation: 'fadeUp 0.45s ease both' }}>
            <div style={{ display: 'inline-block', fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', color: '#e63946', background: '#ffeaec', padding: '4px 12px', borderRadius: 20, marginBottom: 14 }}>
              🏆 LIVE NOW
            </div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#111', lineHeight: 1.05, marginBottom: 12 }}>
              Live <span style={{ color: '#e63946' }}>Contests</span>
            </h1>
            <p style={{ fontSize: 15, color: '#888', fontWeight: 500, maxWidth: 480 }}>
              Join exciting contests and win big prizes. Thousands of players competing right now!
            </p>
          </div>

          {/* ── Error ── */}
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', border: '1.5px solid #ffd0d0', borderRadius: 12, padding: '14px 18px', marginBottom: 28, animation: 'fadeUp 0.3s ease' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#e63946' }}>⚠ {error}</span>
              <button
                className="ct-retry"
                onClick={fetchContests}
                style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', border: '1.5px solid #ddd', borderRadius: 8, padding: '6px 14px', background: '#fff', color: '#555', cursor: 'pointer', transition: 'all 0.15s' }}
              >
                RETRY
              </button>
            </div>
          )}

          {/* ── Grid ── */}
          {contests.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
              {contests.map((contest, i) => {
                const pct = fillPct(contest);
                const tag = getTag(contest);
                const isHovered = hoveredCard === contest.id;
                return (
                  <div
                    key={contest.id}
                    onMouseEnter={() => setHoveredCard(contest.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      background: '#fff',
                      borderRadius: 18,
                      border: `1.5px solid ${isHovered ? '#ddd' : '#ebebeb'}`,
                      padding: '22px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0,
                      transition: 'box-shadow 0.2s, border-color 0.2s, transform 0.2s',
                      boxShadow: isHovered ? '0 10px 32px rgba(0,0,0,0.09)' : '0 2px 8px rgba(0,0,0,0.04)',
                      transform: isHovered ? 'translateY(-2px)' : 'none',
                      animation: `fadeUp 0.4s ease ${i * 0.05}s both`,
                    }}
                  >
                    {/* Card top */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                      <div style={{ flex: 1, paddingRight: 12 }}>
                        <div style={{ marginBottom: 6 }}>
                          <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', color: tag.color, background: tag.bg, padding: '2px 8px', borderRadius: 6 }}>
                            {tag.label}
                          </span>
                        </div>
                        <h5 style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 800, color: '#111', lineHeight: 1.2 }}>
                          {contest.name}
                        </h5>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.08em', color: '#bbb', marginBottom: 2 }}>ENTRY</div>
                        <div style={{ fontSize: 17, fontWeight: 900, color: (contest.entryFee || 0) === 0 ? '#16a34a' : '#111', fontFamily: "'Syne', sans-serif" }}>
                          {(contest.entryFee || 0) === 0 ? 'FREE' : `₹${contest.entryFee}`}
                        </div>
                      </div>
                    </div>

                    {/* Stats row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                      <div style={{ background: '#fafafa', borderRadius: 10, padding: '10px 12px' }}>
                        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.08em', color: '#bbb', marginBottom: 3 }}>SPOTS LEFT</div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#111' }}>
                          {(contest.totalSpots - (contest.joinedSpots || 0)).toLocaleString()}
                          <span style={{ fontSize: 10, fontWeight: 600, color: '#bbb' }}>/{contest.totalSpots?.toLocaleString()}</span>
                        </div>
                      </div>
                      <div style={{ background: '#fafafa', borderRadius: 10, padding: '10px 12px' }}>
                        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.08em', color: '#bbb', marginBottom: 3 }}>PRIZE POOL</div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#16a34a' }}>
                          ₹{contest.prizePool?.toLocaleString() || '0'}
                        </div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 700, color: '#bbb', marginBottom: 5 }}>
                        <span>{pct}% filled</span>
                        <span>{(contest.joinedSpots || 0).toLocaleString()} joined</span>
                      </div>
                      <div style={{ height: 6, background: '#f0f0f0', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${pct}%`,
                          borderRadius: 3,
                          background: pct >= 90 ? 'linear-gradient(90deg,#e63946,#ff6b6b)' : pct >= 60 ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' : 'linear-gradient(90deg,#16a34a,#22c55e)',
                          transition: 'width 0.6s ease',
                        }} />
                      </div>
                    </div>

                    {/* CTA */}
                    <Link
                      to={`/contests/${contest.id}`}
                      className="ct-join-btn"
                      style={{
                        display: 'block',
                        textAlign: 'center',
                        background: '#111',
                        color: '#fff',
                        borderRadius: 11,
                        padding: '12px 0',
                        fontFamily: "'Syne', sans-serif",
                        fontSize: 12,
                        fontWeight: 800,
                        letterSpacing: '0.06em',
                        textDecoration: 'none',
                        transition: 'background 0.18s, transform 0.15s',
                        marginTop: 'auto',
                      }}
                    >
                      JOIN NOW →
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            !error && (
              <div style={{ textAlign: 'center', padding: '60px 0', animation: 'fadeUp 0.4s ease' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>🏏</div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 8 }}>No contests yet</h3>
                <p style={{ fontSize: 14, color: '#aaa', fontWeight: 500 }}>Check back soon for exciting contests!</p>
              </div>
            )
          )}

          {/* ── View All ── */}
          {contests.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: 44, animation: 'fadeUp 0.4s ease 0.3s both' }}>
              <Link
                to="/contests"
                className="ct-view-all"
                style={{
                  display: 'inline-block',
                  border: '2px solid #111',
                  borderRadius: 12,
                  padding: '13px 36px',
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  color: '#111',
                  textDecoration: 'none',
                  transition: 'all 0.18s',
                }}
              >
                VIEW ALL CONTESTS
              </Link>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default Contests;