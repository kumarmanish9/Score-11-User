import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import HeroSection from "../Components/HomeSection/HeroSection1";
import LiveMatches from "../Components/HomeSection/LiveMatches";
import Features from "../Components/HomeSection/Features";
import Players from "../Components/HomeSection/Players";
import Leaderboard from "../Components/HomeSection/Leaderboard";
import Highlights from "../Components/HomeSection/Highlights";
import { getMatches } from "../Services/matchService";
import { getLiveStreams } from "../Services/liveStreamService";
import { getPlayers } from "../Services/playerService";

function Home() {
  const [liveMatches, setLiveMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [featuredPlayers, setFeaturedPlayers] = useState([]);
  const [liveStreams, setLiveStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => { fetchHomeData(); }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      setError('');
      const liveRes     = await getMatches('live').catch(() => []);
      const upcomingRes = await getMatches('upcoming').catch(() => []);
      const playerRes   = await getPlayers().catch(() => []);
      const streamRes   = await getLiveStreams().catch(() => []);
      setLiveMatches(Array.isArray(liveRes)     ? liveRes.slice(0, 6)     : []);
      setUpcomingMatches(Array.isArray(upcomingRes) ? upcomingRes.slice(0, 6) : []);
      setFeaturedPlayers(Array.isArray(playerRes)   ? playerRes.slice(0, 8)   : []);
      setLiveStreams(Array.isArray(streamRes)    ? streamRes.slice(0, 4)   : []);
    } catch (err) {
      console.error('Home data error:', err);
      setError('Unable to load data. Using fallback content.');
      setLiveMatches([]); setUpcomingMatches([]);
      setFeaturedPlayers([]); setLiveStreams([]);
    } finally {
      setLoading(false);
    }
  };

  /* ── Loading screen ── */
  if (loading) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Mulish:wght@400;500;600;700&display=swap');
        @keyframes spin   { to { transform: rotate(360deg) } }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>
      <div style={{
        fontFamily: "'Mulish', sans-serif",
        minHeight: '100vh',
        background: '#f7f7f5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
      }}>
        {/* Animated cricket ball loader */}
        <div style={{ position: 'relative', width: 64, height: 64 }}>
          <div style={{
            width: 64, height: 64,
            borderRadius: '50%',
            border: '3px solid #f0f0f0',
            borderTop: '3px solid #e63946',
            animation: 'spin 0.9s linear infinite',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
          }}>🏏</div>
        </div>
        <div style={{ textAlign: 'center', animation: 'fadeUp 0.5s ease 0.2s both' }}>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 26, fontWeight: 800,
            letterSpacing: '-0.02em', color: '#111',
          }}>
            Scores<span style={{ color: '#e63946' }}>11</span>
          </div>
          <div style={{
            fontSize: 11, fontWeight: 800,
            letterSpacing: '0.12em', color: '#bbb',
            marginTop: 6, animation: 'pulse 1.5s ease infinite',
          }}>
            LOADING SCORE11…
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Mulish:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn  { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
        @keyframes livePulse{ 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
        body { font-family: 'Mulish', sans-serif; background: #f7f7f5; margin: 0; }

        /* Error banner */
        .home-err-banner { animation: fadeUp 0.4s ease; }
        .home-err-retry:hover { background: #111 !important; color: #fff !important; }

        /* Section wrappers */
        .home-section { padding: 60px 20px; }
        .home-section-alt { padding: 60px 20px; background: #fff; }

        /* Section headings */
        .home-section-label {
          display: inline-block;
          font-size: 10px; font-weight: 800; letter-spacing: .12em;
          color: #e63946; background: #ffeaec;
          padding: 4px 12px; border-radius: 20px; margin-bottom: 12px;
        }
        .home-section-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.6rem, 4vw, 2.4rem);
          font-weight: 800; letter-spacing: -.03em;
          color: #111; line-height: 1.05; margin: 0 0 6px;
        }
        .home-section-sub {
          font-size: 14px; color: #888; font-weight: 500;
        }
        .home-section-head {
          display: flex; align-items: flex-end;
          justify-content: space-between; flex-wrap: wrap;
          gap: 12px; margin-bottom: 28px;
        }
        .home-view-all {
          font-size: 11px; font-weight: 800; letter-spacing: .06em;
          color: #555; background: #fff; border: 1.5px solid #e0e0e0;
          border-radius: 8px; padding: 7px 16px; cursor: pointer;
          text-decoration: none; transition: all .15s; font-family: 'Mulish', sans-serif;
        }
        .home-view-all:hover { border-color: #111; color: #111; }

        /* Live dot */
        .live-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #e63946; display: inline-block;
          animation: livePulse 1.2s ease infinite;
          margin-right: 6px;
        }

        /* Stats strip */
        .home-stats { display: flex; gap: 0; background: #fff; border-radius: 20px; border: 1px solid #ebebeb; overflow: hidden; margin-bottom: 0; }
        .home-stat { flex: 1; padding: 20px; text-align: center; border-right: 1px solid #f0f0f0; animation: fadeUp .4s ease both; }
        .home-stat:last-child { border-right: none; }
        .home-stat-num { font-family: 'Syne', sans-serif; font-size: 1.8rem; font-weight: 800; color: #111; line-height: 1; }
        .home-stat-lbl { font-size: 10px; font-weight: 800; letter-spacing: .08em; color: #bbb; margin-top: 4px; }

        /* Refresh btn */
        .home-refresh:hover { background: #e63946 !important; border-color: #e63946 !important; color: #fff !important; }
      `}</style>

      <div style={{ fontFamily: "'Mulish', sans-serif", background: '#f7f7f5', minHeight: '100vh' }}>

        {/* ── Hero ── */}
        <HeroSection featuredMatches={liveMatches.slice(0, 1)} user={user} />

        {/* ── Stats strip ── */}
        <div style={{ padding: '0 20px', maxWidth: 1060, margin: '0 auto', transform: 'translateY(-28px)', position: 'relative', zIndex: 10 }}>
          <div className="home-stats">
            {[
              { num: `${liveMatches.length}`, lbl: 'LIVE MATCHES', color: '#e63946', delay: '0s' },
              { num: `${upcomingMatches.length}`, lbl: 'UPCOMING',     color: '#2563eb', delay: '.06s' },
              { num: `${featuredPlayers.length}`, lbl: 'TOP PLAYERS',  color: '#16a34a', delay: '.12s' },
              { num: `${liveStreams.length}`,     lbl: 'LIVE STREAMS', color: '#7c3aed', delay: '.18s' },
            ].map(({ num, lbl, color, delay }) => (
              <div key={lbl} className="home-stat" style={{ animationDelay: delay }}>
                <div className="home-stat-num" style={{ color }}>{num || '—'}</div>
                <div className="home-stat-lbl">{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Live Matches section ── */}
        <div className="home-section" style={{ maxWidth: 1060, margin: '0 auto', padding: '20px 20px 60px' }}>
          <div className="home-section-head">
            <div>
              <div className="home-section-label">
                <span className="live-dot" />LIVE NOW
              </div>
              <h2 className="home-section-title">Live & Upcoming <span style={{ color: '#e63946' }}>Matches</span></h2>
              <p className="home-section-sub">Real-time scores updated every ball</p>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button
                className="home-refresh"
                onClick={fetchHomeData}
                style={{
                  fontSize: 11, fontWeight: 800, letterSpacing: '.06em',
                  color: '#555', background: '#fff',
                  border: '1.5px solid #e0e0e0', borderRadius: 8,
                  padding: '7px 14px', cursor: 'pointer',
                  transition: 'all .15s', fontFamily: "'Mulish', sans-serif",
                }}
              >
                ↻ REFRESH
              </button>
              <a href="/matches" className="home-view-all">VIEW ALL →</a>
            </div>
          </div>
          <LiveMatches live={liveMatches} upcoming={upcomingMatches} refresh={fetchHomeData} />
        </div>

        {/* ── Features (alt bg) ── */}
        <div className="home-section-alt">
          <div style={{ maxWidth: 1060, margin: '0 auto' }}>
            <div className="home-section-head">
              <div>
                <div className="home-section-label">WHY SCORE11</div>
                <h2 className="home-section-title">Built for <span style={{ color: '#e63946' }}>SCORES11</span></h2>
                <p className="home-section-sub">Everything you need in one platform</p>
              </div>
            </div>
            <Features />
          </div>
        </div>

        {/* ── Players ── */}
        <div className="home-section" style={{ maxWidth: 1060, margin: '0 auto' }}>
          <div className="home-section-head">
            <div>
              <div className="home-section-label">FANTASY PICKS</div>
              <h2 className="home-section-title">Featured <span style={{ color: '#e63946' }}>Players</span></h2>
              <p className="home-section-sub">Top performers to build your dream team</p>
            </div>
            <a href="/players" className="home-view-all">VIEW ALL →</a>
          </div>
          <Players players={featuredPlayers} />
        </div>

        {/* ── Leaderboard (alt bg) ── */}
        <div className="home-section-alt">
          <div style={{ maxWidth: 1060, margin: '0 auto' }}>
            <div className="home-section-head">
              <div>
                <div className="home-section-label">🏆 RANKINGS</div>
                <h2 className="home-section-title">Leaderboard & <span style={{ color: '#e63946' }}>Streams</span></h2>
                <p className="home-section-sub">Top players this week</p>
              </div>
              <a href="/leaderboard" className="home-view-all">FULL BOARD →</a>
            </div>
            <Leaderboard streams={liveStreams} />
          </div>
        </div>

        {/* ── Highlights ── */}
        <div className="home-section" style={{ maxWidth: 1060, margin: '0 auto' }}>
          <div className="home-section-head">
            <div>
              <div className="home-section-label">MATCH HIGHLIGHTS</div>
              <h2 className="home-section-title">Recent <span style={{ color: '#e63946' }}>Highlights</span></h2>
              <p className="home-section-sub">Key moments from today's matches</p>
            </div>
          </div>
          <Highlights matches={liveMatches} />
        </div>

        {/* ── Error banner ── */}
        {error && (
          <div
            className="home-err-banner"
            style={{
              margin: '0 20px 32px',
              background: '#fff',
              border: '1.5px solid #ffd0d0',
              borderRadius: 14,
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              maxWidth: 1060,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: '#e63946' }}>⚠ {error}</span>
            <button
              className="home-err-retry"
              onClick={fetchHomeData}
              style={{
                fontSize: 11, fontWeight: 800, letterSpacing: '.06em',
                border: '1.5px solid #ddd', borderRadius: 8,
                padding: '6px 14px', background: '#fff',
                color: '#555', cursor: 'pointer',
                transition: 'all .15s', fontFamily: "'Mulish', sans-serif",
              }}
            >
              RETRY
            </button>
          </div>
        )}

      </div>
    </>
  );
}

export default Home;