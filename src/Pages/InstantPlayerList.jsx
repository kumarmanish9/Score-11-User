import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getAllPlayers, deletePlayer } from '../Services/playerService';

const PLAYERS_PER_PAGE = 10;

const ROLE_CONFIG = {
  'batsman':       { label: 'Batsman',      emoji: '🏏', color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' },
  'bowler':        { label: 'Bowler',        emoji: '⚾', color: '#DC2626', bg: '#FFF1F2', border: '#FECDD3' },
  'all-rounder':   { label: 'All-rounder',   emoji: '⚡', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  'wicket-keeper': { label: 'Wicket Keeper', emoji: '🧤', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
};

const getRoleConfig = (role) =>
  ROLE_CONFIG[role] || { label: role, emoji: '👤', color: '#6B7280', bg: '#F9FAFB', border: '#E5E7EB' };

const avatarColor = (name) => {
  const colors = ['#E87040', '#16A34A', '#7C3AED', '#0369A1', '#DC2626', '#D97706', '#0891B2', '#BE185D'];
  let h = 0;
  for (let i = 0; i < (name || '').length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return colors[Math.abs(h) % colors.length];
};

const initials = (name) =>
  name ? name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() : '?';

function InstantPlayerList() {
  const [searchParams, setSearchParams]       = useSearchParams();
  const [players, setPlayers]                 = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [search, setSearch]                   = useState('');
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [currentPage, setCurrentPage]         = useState(1);
  const [deletingId, setDeletingId]           = useState(null);
  const [searchFocused, setSearchFocused]     = useState(false);

  useEffect(() => { fetchPlayers(); }, []);

  useEffect(() => {
    if (searchParams.get('refresh')) {
      fetchPlayers();
      const p = new URLSearchParams(searchParams.toString());
      p.delete('refresh');
      setSearchParams(p);
    }
  }, [searchParams]);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const data = await getAllPlayers();
      setPlayers(data);
      setFilteredPlayers(data);
    } catch (err) {
      console.error('[PLAYER-LIST] Fetch error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const term = search.toLowerCase();
    const filtered = players.filter(p =>
      p.playerName.toLowerCase().includes(term) ||
      p.role.toLowerCase().includes(term) ||
      (p.teamName && p.teamName.toLowerCase().includes(term))
    );
    setFilteredPlayers(filtered);
    setCurrentPage(1);
  }, [search, players]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this player?')) return;
    try {
      setDeletingId(id);
      await deletePlayer(id);
      await fetchPlayers();
    } catch {
      alert('Error deleting player');
    } finally {
      setDeletingId(null);
    }
  };

  /* ── Pagination ── */
  const totalPages  = Math.ceil(filteredPlayers.length / PLAYERS_PER_PAGE);
  const startIndex  = (currentPage - 1) * PLAYERS_PER_PAGE;
  const endIndex    = startIndex + PLAYERS_PER_PAGE;
  const pagePlayers = filteredPlayers.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4)            return [1, 2, 3, 4, 5, '...', totalPages];
    if (currentPage >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  /* ── Loading screen ── */
  if (loading) {
    return (
      <>
        <style>{globalStyles}</style>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9FAFB' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="ipl-spinner" style={{ margin: '0 auto 14px' }} />
            <p style={{ fontSize: 13, color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif" }}>Loading players…</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{globalStyles}</style>

      <div className="ipl-root">
        <div className="ipl-container">

          {/* ── Page header ── */}
          <div className="ipl-header">
            <div style={{ animation: 'fadeUp .38s ease both' }}>
              <p className="ipl-eyebrow">Player Management</p>
              <h1 className="ipl-title">Player <em>Directory</em></h1>
              <p className="ipl-subtitle">
                {players.length} total player{players.length !== 1 ? 's' : ''}
                {search && <span style={{ color: '#D85A30' }}> · {filteredPlayers.length} matched</span>}
              </p>
            </div>
            <div className="ipl-header-actions" style={{ animation: 'fadeUp .38s ease .05s both' }}>
              <button className="ipl-refresh-btn" onClick={fetchPlayers} title="Refresh">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7a6 6 0 1 0 1.07-3.43M1 2v2.5h2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <Link to="/instant-player-create" className="ipl-add-btn">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                </svg>
                Add Player
              </Link>
            </div>
          </div>

          {/* ── Role stats strip ── */}
          <div className="ipl-stats-strip" style={{ animation: 'fadeUp .38s ease .07s both' }}>
            {Object.entries(ROLE_CONFIG).map(([key, rc]) => {
              const count = players.filter(p => p.role === key).length;
              return (
                <div key={key} className="ipl-stat-pill">
                  <span style={{ fontSize: 14 }}>{rc.emoji}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{count}</span>
                  <span style={{ fontSize: 11, color: '#9CA3AF' }}>{rc.label}</span>
                </div>
              );
            })}
          </div>

          {/* ── Search bar ── */}
          <div style={{ animation: 'fadeUp .38s ease .1s both', marginBottom: 16 }}>
            <div
              className="ipl-search-box"
              style={{
                borderColor: searchFocused ? '#111827' : '#E5E7EB',
                boxShadow: searchFocused ? '0 0 0 3px rgba(17,24,39,.07)' : 'none',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ color: '#9CA3AF', flexShrink: 0 }}>
                <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search by name, role or team…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="ipl-search-input"
              />
              {search && (
                <button className="ipl-clear-btn" onClick={() => setSearch('')} aria-label="Clear search">
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M1.5 1.5l8 8M9.5 1.5l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* ── Main card ── */}
          <div className="ipl-card" style={{ animation: 'fadeUp .38s ease .13s both' }}>
            {filteredPlayers.length > 0 ? (
              <>
                <div className="ipl-table-wrap">
                  <table className="ipl-table">
                    <thead>
                      <tr>
                        <th style={{ width: 36, textAlign: 'center' }}>#</th>
                        <th>Player</th>
                        <th style={{ textAlign: 'center' }}>Jersey</th>
                        <th>Role</th>
                        <th>Team</th>
                        <th style={{ textAlign: 'center' }}>Joined</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagePlayers.map((player, i) => {
                        const rc    = getRoleConfig(player.role);
                        const color = avatarColor(player.playerName);
                        return (
                          <tr key={player._id} style={{ animation: `fadeUp .22s ease ${i * 0.022}s both` }}>

                            {/* Row number */}
                            <td style={{ textAlign: 'center' }}>
                              <span style={{ fontSize: 11, color: '#D1D5DB', fontWeight: 500 }}>
                                {startIndex + i + 1}
                              </span>
                            </td>

                            {/* Player */}
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{
                                  width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                                  background: color + '18', border: `1px solid ${color}28`,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontFamily: "'DM Serif Display', serif",
                                  fontSize: 12, color,
                                }}>
                                  {initials(player.playerName)}
                                </div>
                                <div>
                                  <p style={{ fontSize: 13, fontWeight: 500, color: '#111827', margin: 0, lineHeight: 1.3 }}>
                                    {player.playerName}
                                  </p>
                                  <p style={{ fontSize: 10, color: '#D1D5DB', margin: '1px 0 0', fontFamily: 'monospace', letterSpacing: '.04em' }}>
                                    {player._id.slice(-6).toUpperCase()}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Jersey */}
                            <td style={{ textAlign: 'center' }}>
                              <span style={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                width: 30, height: 30, borderRadius: 7,
                                background: '#F3F4F6', border: '1px solid #E5E7EB',
                                fontFamily: "'DM Serif Display', serif",
                                fontSize: 12, color: '#374151',
                              }}>
                                {player.jerseyNumber || '—'}
                              </span>
                            </td>

                            {/* Role */}
                            <td>
                              <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: 5,
                                padding: '3px 9px',
                                background: rc.bg, border: `1px solid ${rc.border}`,
                                borderRadius: 20,
                                fontSize: 10, fontWeight: 600, color: rc.color,
                                letterSpacing: '.04em', textTransform: 'uppercase',
                              }}>
                                <span style={{ fontSize: 11 }}>{rc.emoji}</span>
                                {rc.label}
                              </span>
                            </td>

                            {/* Team */}
                            <td>
                              <span style={{ fontSize: 13, color: '#374151' }}>
                                {player.teamName || player.team?.name || (
                                  <em style={{ color: '#D1D5DB', fontSize: 12, fontStyle: 'italic' }}>Independent</em>
                                )}
                              </span>
                            </td>

                            {/* Date */}
                            <td style={{ textAlign: 'center' }}>
                              <span style={{ fontSize: 11, color: '#9CA3AF', whiteSpace: 'nowrap' }}>
                                {new Date(player.createdAt).toLocaleDateString('en-IN', {
                                  day: '2-digit', month: 'short', year: 'numeric',
                                })}
                              </span>
                            </td>

                            {/* Actions */}
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                                <Link to={`/players/${player._id}`} className="ipl-btn-edit" title="Edit">
                                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                                    <path d="M8.5 1.5l2 2-7 7H1.5v-2l7-7z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                                  </svg>
                                  Edit
                                </Link>
                                <button
                                  className="ipl-btn-delete"
                                  onClick={() => handleDelete(player._id)}
                                  disabled={deletingId === player._id}
                                  title="Delete"
                                >
                                  {deletingId === player._id ? (
                                    <div className="ipl-spinner-sm" />
                                  ) : (
                                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                                      <path d="M1.5 3h9M4 3V2h4v1M5 5.5v3M7 5.5v3M2.5 3l.75 7.5h5.5L9.5 3"
                                        stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  )}
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* ── Pagination footer ── */}
                <div className="ipl-pagination-bar">
                  <span className="ipl-page-info">
                    Showing{' '}
                    <strong>{startIndex + 1}–{Math.min(endIndex, filteredPlayers.length)}</strong>
                    {' '}of <strong>{filteredPlayers.length}</strong> players
                  </span>

                  {totalPages > 1 && (
                    <div className="ipl-page-controls">
                      {/* Prev */}
                      <button
                        className="ipl-page-btn"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        title="Previous"
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M7.5 9.5L4 6l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>

                      {/* Page numbers */}
                      {getPageNumbers().map((pg, idx) =>
                        pg === '...' ? (
                          <span key={`e${idx}`} className="ipl-page-ellipsis">…</span>
                        ) : (
                          <button
                            key={pg}
                            className={`ipl-page-btn${currentPage === pg ? ' ipl-page-active' : ''}`}
                            onClick={() => goToPage(pg)}
                          >
                            {pg}
                          </button>
                        )
                      )}

                      {/* Next */}
                      <button
                        className="ipl-page-btn"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        title="Next"
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M4.5 2.5L8 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* ── Empty state ── */
              <div style={{ textAlign: 'center', padding: '60px 24px' }}>
                <div style={{
                  width: 60, height: 60, borderRadius: 15,
                  background: '#F9FAFB', border: '1px solid #E5E7EB',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26, margin: '0 auto 16px',
                }}>
                  🏏
                </div>
                <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.15rem', color: '#111827', marginBottom: 5 }}>
                  {search ? 'No players matched' : 'No players yet'}
                </h3>
                <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 20 }}>
                  {search ? 'Try a different search term.' : 'Start by adding your first player.'}
                </p>
                {!search && (
                  <Link to="/instant-player-create" className="ipl-add-btn" style={{ display: 'inline-flex' }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                    </svg>
                    Add First Player
                  </Link>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────── */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
  @keyframes spin   { to { transform:rotate(360deg) } }

  .ipl-root { font-family:'DM Sans',sans-serif; background:#F9FAFB; min-height:100vh; padding:40px 20px 80px; }
  .ipl-container { max-width:1040px; margin:0 auto; }

  .ipl-eyebrow { font-size:10px; font-weight:600; letter-spacing:.13em; color:#9CA3AF; text-transform:uppercase; margin-bottom:6px; }
  .ipl-title { font-family:'DM Serif Display',serif; font-size:1.75rem; font-weight:400; color:#111827; line-height:1.2; margin-bottom:4px; }
  .ipl-title em { font-style:italic; color:#D85A30; }
  .ipl-subtitle { font-size:13px; color:#6B7280; }
  .ipl-header { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; flex-wrap:wrap; margin-bottom:18px; }
  .ipl-header-actions { display:flex; align-items:center; gap:8px; flex-shrink:0; padding-top:6px; }

  .ipl-stats-strip { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:16px; }
  .ipl-stat-pill { display:inline-flex; align-items:center; gap:6px; padding:6px 12px; background:#fff; border:1px solid #E5E7EB; border-radius:20px; transition:border-color .15s; }
  .ipl-stat-pill:hover { border-color:#D1D5DB; }

  .ipl-refresh-btn { display:inline-flex; align-items:center; justify-content:center; width:36px; height:36px; border-radius:9px; background:#fff; border:1px solid #E5E7EB; color:#6B7280; cursor:pointer; transition:all .15s; }
  .ipl-refresh-btn:hover { background:#F3F4F6; border-color:#D1D5DB; color:#111827; }

  .ipl-add-btn { display:inline-flex; align-items:center; gap:7px; padding:9px 16px; background:#111827; color:#fff; border:none; border-radius:9px; font-family:'DM Sans',sans-serif; font-size:12px; font-weight:600; letter-spacing:.05em; text-decoration:none; cursor:pointer; transition:opacity .15s, transform .15s, box-shadow .15s; box-shadow:0 2px 6px rgba(17,24,39,.14); }
  .ipl-add-btn:hover { opacity:.85; transform:translateY(-1px); box-shadow:0 4px 14px rgba(17,24,39,.2); color:#fff; text-decoration:none; }

  .ipl-search-box { display:flex; align-items:center; gap:10px; max-width:440px; background:#fff; border:1px solid #E5E7EB; border-radius:10px; padding:9px 13px; transition:border-color .18s, box-shadow .18s; }
  .ipl-search-input { flex:1; border:none; outline:none; font-family:'DM Sans',sans-serif; font-size:13px; color:#111827; background:transparent; }
  .ipl-search-input::placeholder { color:#9CA3AF; }
  .ipl-clear-btn { display:flex; align-items:center; justify-content:center; width:20px; height:20px; border-radius:50%; background:#F3F4F6; border:none; cursor:pointer; color:#9CA3AF; transition:all .15s; flex-shrink:0; }
  .ipl-clear-btn:hover { background:#E5E7EB; color:#111827; }

  .ipl-card { background:#fff; border:1px solid #E5E7EB; border-radius:16px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.05); }
  .ipl-table-wrap { overflow-x:auto; }
  .ipl-table { width:100%; border-collapse:collapse; }
  .ipl-table thead tr { border-bottom:1px solid #F3F4F6; }
  .ipl-table th { padding:12px 14px; font-size:10px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:#9CA3AF; background:#FAFAFA; white-space:nowrap; }
  .ipl-table tbody tr { border-bottom:1px solid #F9FAFB; transition:background .12s; }
  .ipl-table tbody tr:last-child { border-bottom:none; }
  .ipl-table tbody tr:hover { background:#FAFAFA; }
  .ipl-table td { padding:12px 14px; vertical-align:middle; }

  .ipl-btn-edit, .ipl-btn-delete { display:inline-flex; align-items:center; gap:5px; padding:5px 10px; border-radius:7px; font-family:'DM Sans',sans-serif; font-size:11px; font-weight:500; cursor:pointer; text-decoration:none; white-space:nowrap; transition:all .15s; }
  .ipl-btn-edit  { background:#F0F9FF; border:1px solid #BAE6FD; color:#0369A1; }
  .ipl-btn-edit:hover { background:#E0F2FE; color:#0369A1; text-decoration:none; }
  .ipl-btn-delete { background:#FFF1F2; border:1px solid #FECDD3; color:#DC2626; }
  .ipl-btn-delete:hover:not(:disabled) { background:#FFE4E6; }
  .ipl-btn-delete:disabled { opacity:.5; cursor:not-allowed; }

  .ipl-pagination-bar { display:flex; align-items:center; justify-content:space-between; padding:13px 18px; border-top:1px solid #F3F4F6; flex-wrap:wrap; gap:12px; background:#FAFAFA; border-radius:0 0 16px 16px; }
  .ipl-page-info { font-size:12px; color:#9CA3AF; }
  .ipl-page-info strong { color:#374151; font-weight:600; }
  .ipl-page-controls { display:flex; align-items:center; gap:3px; }
  .ipl-page-btn { display:inline-flex; align-items:center; justify-content:center; min-width:32px; height:32px; padding:0 8px; border:1px solid #E5E7EB; border-radius:8px; background:#fff; color:#374151; font-family:'DM Sans',sans-serif; font-size:12px; font-weight:500; cursor:pointer; transition:all .15s; }
  .ipl-page-btn:hover:not(:disabled):not(.ipl-page-active) { background:#F3F4F6; border-color:#D1D5DB; }
  .ipl-page-btn:disabled { opacity:.35; cursor:not-allowed; }
  .ipl-page-active { background:#111827 !important; border-color:#111827 !important; color:#fff !important; }
  .ipl-page-ellipsis { display:inline-flex; align-items:center; justify-content:center; width:32px; height:32px; font-size:12px; color:#9CA3AF; }

  .ipl-spinner { width:36px; height:36px; border:3px solid #E5E7EB; border-top-color:#111827; border-radius:50%; animation:spin .7s linear infinite; }
  .ipl-spinner-sm { width:10px; height:10px; border:1.5px solid #FECDD3; border-top-color:#DC2626; border-radius:50%; animation:spin .65s linear infinite; }
`;

export default InstantPlayerList;