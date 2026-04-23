import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPlayer } from '../Services/playerService';

const ROLES = [
  { value: 'batsman',       label: 'Batsman',      emoji: '🏏' },
  { value: 'bowler',        label: 'Bowler',        emoji: '⚾' },
  { value: 'all-rounder',   label: 'All-rounder',   emoji: '⚡' },
  { value: 'wicket-keeper', label: 'Wicket Keeper', emoji: '🧤' },
];

function InstantPlayerCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    playerName: '',
    jerseyNumber: '',
    role: 'batsman',
    teamName: '',
  });
  const [loading, setLoading]   = useState(false);
  const [focused, setFocused]   = useState(null);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState('');

  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.playerName.trim()) {
      setError('Player name is required.');
      return;
    }
    setError('');
    try {
      setLoading(true);
      await createPlayer(formData);
      setSuccess(true);
      setTimeout(() => navigate('/instant-player-list?refresh=1'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = ROLES.find(r => r.value === formData.role);

  /* ─── inline styles ──────────────────────────────────────────────── */
  const inputBase = (field) => ({
    width: '100%',
    padding: '11px 14px',
    border: `1px solid ${focused === field ? '#111827' : '#E5E7EB'}`,
    borderRadius: 10,
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 400,
    color: '#111827',
    background: '#fff',
    outline: 'none',
    transition: 'border-color .18s, box-shadow .18s',
    boxShadow: focused === field ? '0 0 0 3px rgba(17,24,39,0.07)' : 'none',
    WebkitAppearance: 'none',
    appearance: 'none',
  });

  return (
    <>
      {/* ── global styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp  { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes spin    { to   { transform:rotate(360deg) } }
        @keyframes checkPop{ 0%  { transform:scale(0) } 70% { transform:scale(1.2) } 100% { transform:scale(1) } }
        @keyframes pulse   { 0%,100% { opacity:1 } 50% { opacity:.45 } }
        @keyframes shimmer { 0% { background-position:200% center } 100% { background-position:-200% center } }

        .ipc-root {
          font-family: 'DM Sans', sans-serif;
          background: #F9FAFB;
          min-height: 100vh;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 44px 20px 88px;
        }

        .ipc-back:hover  { background: #F3F4F6 !important; border-color: #D1D5DB !important; }
        .ipc-pill:hover  { border-color: #9CA3AF !important; }
        .ipc-submit:hover:not(:disabled) { background: #1F2937 !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(17,24,39,.18) !important; }
        .ipc-submit:active:not(:disabled) { transform: translateY(0); }
        .ipc-field-wrap input::-webkit-outer-spin-button,
        .ipc-field-wrap input::-webkit-inner-spin-button { -webkit-appearance: none; }
        ::placeholder { color: #9CA3AF; }
      `}</style>

      <div className="ipc-root">
        <div style={{ width: '100%', maxWidth: 540, animation: 'fadeUp 0.42s ease both' }}>

          {/* ── Back ── */}
          <button
            className="ipc-back"
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              marginBottom: 18,
              background: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: 9,
              padding: '7px 13px',
              fontSize: 12,
              fontWeight: 500,
              color: '#6B7280',
              cursor: 'pointer',
              transition: 'background .15s, border-color .15s',
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: '.01em',
            }}
          >
            ← Back
          </button>

          {/* ── Card ── */}
          <div style={{
            background: '#fff',
            borderRadius: 18,
            border: '1px solid #E5E7EB',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,.04), 0 8px 32px rgba(0,0,0,.06)',
          }}>

            {/* Card header */}
            <div style={{
              padding: '26px 28px 22px',
              borderBottom: '1px solid #F3F4F6',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 12,
            }}>
              <div>
                <p style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '.13em',
                  color: '#9CA3AF',
                  textTransform: 'uppercase',
                  marginBottom: 7,
                }}>
                  Player Management
                </p>
                <h1 style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: '1.55rem',
                  fontWeight: 400,
                  color: '#111827',
                  lineHeight: 1.2,
                  margin: 0,
                }}>
                  Instant Player{' '}
                  <em style={{ fontStyle: 'italic', color: '#D85A30' }}>Create</em>
                </h1>
                <p style={{ margin: '6px 0 0', fontSize: 13, color: '#6B7280', fontWeight: 400 }}>
                  Quickly add custom players to your portal
                </p>
              </div>
              <div style={{
                width: 44, height: 44,
                borderRadius: 12,
                background: '#FFF7ED',
                border: '1px solid #FDE8D5',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0,
              }}>
                🏏
              </div>
            </div>

            {/* Card body */}
            <div style={{ padding: '26px 28px 32px' }}>

              {/* ── Success state ── */}
              {success ? (
                <div style={{ textAlign: 'center', padding: '28px 0', animation: 'fadeUp .4s ease' }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: '#F0FDF4',
                    border: '1px solid #BBF7D0',
                    margin: '0 auto 14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: 'checkPop .4s ease',
                  }}>
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                      <path d="M4 11.5L9 16.5L18 6" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.15rem', color: '#111827', marginBottom: 5 }}>
                    Player Created!
                  </p>
                  <p style={{ fontSize: 13, color: '#9CA3AF', animation: 'pulse 1.1s ease infinite' }}>
                    Redirecting…
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>

                  {/* ── Error banner ── */}
                  {error && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      background: '#FFF1F2',
                      border: '1px solid #FECDD3',
                      borderRadius: 10,
                      padding: '10px 14px',
                      marginBottom: 18,
                      animation: 'fadeUp .25s ease',
                    }}>
                      <span style={{ fontSize: 14 }}>⚠️</span>
                      <p style={{ fontSize: 13, color: '#BE123C', fontWeight: 500, margin: 0 }}>{error}</p>
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="ipc-field-wrap">

                    {/* Player Name */}
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={labelStyle}>Player Name <span style={{ color: '#E87040' }}>*</span></label>
                      <input
                        type="text"
                        placeholder="e.g. Virat Kohli"
                        value={formData.playerName}
                        onChange={e => { set('playerName', e.target.value); if (error) setError(''); }}
                        onFocus={() => setFocused('playerName')}
                        onBlur={() => setFocused(null)}
                        style={inputBase('playerName')}
                        required
                      />
                    </div>

                    {/* Jersey Number */}
                    <div>
                      <label style={labelStyle}>Jersey Number</label>
                      <input
                        type="number"
                        placeholder="18"
                        min="0" max="999"
                        value={formData.jerseyNumber}
                        onChange={e => set('jerseyNumber', e.target.value)}
                        onFocus={() => setFocused('jerseyNumber')}
                        onBlur={() => setFocused(null)}
                        style={inputBase('jerseyNumber')}
                      />
                    </div>

                    {/* Team Name */}
                    <div>
                      <label style={labelStyle}>
                        Team Name{' '}
                        <span style={{ color: '#D1D5DB', fontSize: 10, fontWeight: 400 }}>(optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Mumbai Indians"
                        value={formData.teamName}
                        onChange={e => set('teamName', e.target.value)}
                        onFocus={() => setFocused('teamName')}
                        onBlur={() => setFocused(null)}
                        style={inputBase('teamName')}
                      />
                    </div>

                    {/* Role pills */}
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ ...labelStyle, marginBottom: 10, display: 'block' }}>
                        Role <span style={{ color: '#E87040' }}>*</span>
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                        {ROLES.map(r => {
                          const active = formData.role === r.value;
                          return (
                            <button
                              key={r.value}
                              type="button"
                              className="ipc-pill"
                              onClick={() => set('role', r.value)}
                              style={{
                                padding: '10px 6px 9px',
                                borderRadius: 10,
                                border: `1px solid ${active ? '#111827' : '#E5E7EB'}`,
                                background: active ? '#111827' : '#fff',
                                color: active ? '#fff' : '#6B7280',
                                cursor: 'pointer',
                                textAlign: 'center',
                                transition: 'all .16s',
                                fontFamily: "'DM Sans', sans-serif",
                              }}
                            >
                              <span style={{ fontSize: 18, display: 'block', marginBottom: 4 }}>{r.emoji}</span>
                              <span style={{
                                fontSize: 9, fontWeight: 600,
                                letterSpacing: '.05em', textTransform: 'uppercase',
                                display: 'block',
                                color: active ? '#E5E7EB' : '#9CA3AF',
                              }}>
                                {r.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* ── Live preview strip ── */}
                  {formData.playerName.trim() && (
                    <div style={{
                      marginTop: 20,
                      display: 'flex', alignItems: 'center', gap: 13,
                      background: '#F9FAFB',
                      border: '1px solid #F3F4F6',
                      borderRadius: 12,
                      padding: '12px 15px',
                      animation: 'fadeUp .28s ease',
                    }}>
                      {/* Avatar */}
                      <div style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: '#fff',
                        border: '1px solid #E5E7EB',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: "'DM Serif Display', serif",
                        fontSize: 16, color: '#111827',
                        flexShrink: 0,
                      }}>
                        {formData.jerseyNumber || formData.playerName.trim()[0]?.toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontFamily: "'DM Serif Display', serif",
                          fontSize: 14, color: '#111827',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          margin: 0,
                        }}>
                          {formData.playerName}
                        </p>
                        <p style={{ fontSize: 11, color: '#9CA3AF', margin: '2px 0 0' }}>
                          {selectedRole?.emoji} {selectedRole?.label}
                          {formData.teamName && <span> · {formData.teamName}</span>}
                        </p>
                      </div>
                      <span style={{
                        fontSize: 9, fontWeight: 600, letterSpacing: '.1em',
                        color: '#D1D5DB', textTransform: 'uppercase', flexShrink: 0,
                      }}>
                        Preview
                      </span>
                    </div>
                  )}

                  {/* ── Divider ── */}
                  <div style={{ height: 1, background: '#F3F4F6', margin: '22px 0 20px' }} />

                  {/* ── Submit button ── */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="ipc-submit"
                    style={{
                      width: '100%',
                      padding: '13px 0',
                      background: '#111827',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 11,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: '.08em',
                      textTransform: 'uppercase',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.65 : 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                      transition: 'background .18s, transform .15s, box-shadow .18s',
                      boxShadow: '0 2px 6px rgba(17,24,39,.12)',
                    }}
                  >
                    {loading ? (
                      <>
                        <div style={{
                          width: 15, height: 15,
                          border: '2px solid rgba(255,255,255,.25)',
                          borderTop: '2px solid #fff',
                          borderRadius: '50%',
                          animation: 'spin .65s linear infinite',
                        }} />
                        Creating…
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="7" cy="7" r="6.25" stroke="rgba(255,255,255,.35)" strokeWidth="1.25"/>
                          <path d="M7 4v6M4 7h6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        Create Player
                      </>
                    )}
                  </button>

                </form>
              )}
            </div>
          </div>

          {/* ── Footer note ── */}
          {!success && (
            <p style={{
              textAlign: 'center', fontSize: 11,
              color: '#D1D5DB', marginTop: 14,
              fontFamily: "'DM Sans', sans-serif",
            }}>
              Fields marked <span style={{ color: '#E87040' }}>*</span> are required
            </p>
          )}
        </div>
      </div>
    </>
  );
}

/* ─── shared label style ─────────────────────────────── */
const labelStyle = {
  display: 'block',
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: '.1em',
  color: '#9CA3AF',
  textTransform: 'uppercase',
  marginBottom: 7,
};

export default InstantPlayerCreate;