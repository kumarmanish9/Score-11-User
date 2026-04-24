import React, { useState } from 'react';

const Community = () => {
  const [liked, setLiked] = useState({});

  const posts = [
    {
      id: 1,
      name: 'John Doe',
      handle: '@johndoe',
      avatar: 'https://i.pravatar.cc/48?img=1',
      time: '2 hours ago',
      content: 'Looking for players for weekend tournament! We need 4 more skilled players to complete our team. DM me if you\'re interested! 🔥',
      comments: 12,
      likes: 34,
      tag: 'Tournament',
      tagColor: '#f97316',
    },
    {
      id: 2,
      name: 'Sarah Kim',
      handle: '@sarahkim',
      avatar: 'https://i.pravatar.cc/48?img=5',
      time: '5 hours ago',
      content: 'Just hit Diamond rank after 3 months of grinding. Consistency is the key — play every day, review replays, and never tilt. 💎',
      comments: 28,
      likes: 91,
      tag: 'Milestone',
      tagColor: '#6366f1',
    },
    {
      id: 3,
      name: 'Alex Rivera',
      handle: '@alexrivera',
      avatar: 'https://i.pravatar.cc/48?img=3',
      time: '1 day ago',
      content: 'PSA: The new map update drops this Friday. Here\'s everything you need to know about the new spawn zones and rotation paths. 🗺️',
      comments: 45,
      likes: 127,
      tag: 'News',
      tagColor: '#10b981',
    },
  ];

  const trending = [
    { id: 1, title: 'Tournament XYZ', count: '2.4k mentions', emoji: '🏆' },
    { id: 2, title: 'Patch Notes v2.1', count: '1.8k mentions', emoji: '📋' },
    { id: 3, title: 'Weekend Scrims', count: '967 mentions', emoji: '⚔️' },
    { id: 4, title: 'Pro Tips & Tricks', count: '743 mentions', emoji: '💡' },
    { id: 5, title: 'Ranked Season End', count: '612 mentions', emoji: '🎯' },
  ];

  const onlineMembers = [
    { name: 'ProSniper', avatar: 'https://i.pravatar.cc/32?img=10', status: 'In Game' },
    { name: 'TacticalX', avatar: 'https://i.pravatar.cc/32?img=11', status: 'Online' },
    { name: 'QuickRefl', avatar: 'https://i.pravatar.cc/32?img=12', status: 'Online' },
    { name: 'NightOwl', avatar: 'https://i.pravatar.cc/32?img=13', status: 'In Game' },
  ];

  const toggleLike = (id) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Mulish:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .comm-root {
          font-family: 'Mulish', sans-serif;
          background: #f8f8f6;
          min-height: 100vh;
          padding: 40px 20px 60px;
          color: #1a1a1a;
        }

        /* ── Header ── */
        .comm-header {
          max-width: 1100px;
          margin: 0 auto 40px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .comm-header-left h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1;
          color: #111;
        }

        .comm-header-left h1 span {
          color: #f97316;
        }

        .comm-header-left p {
          margin-top: 8px;
          font-size: 0.9rem;
          color: #888;
          font-weight: 500;
        }

        .comm-new-post-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #111;
          color: #fff;
          border: none;
          padding: 12px 22px;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          white-space: nowrap;
        }

        .comm-new-post-btn:hover {
          background: #f97316;
          transform: translateY(-1px);
        }

        /* ── Layout ── */
        .comm-layout {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 24px;
          align-items: start;
        }

        @media (max-width: 768px) {
          .comm-layout { grid-template-columns: 1fr; }
        }

        /* ── Card ── */
        .comm-card {
          background: #fff;
          border-radius: 20px;
          border: 1px solid #ebebeb;
          overflow: hidden;
        }

        .comm-card-header {
          padding: 22px 24px 18px;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .comm-card-header h3 {
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #111;
          letter-spacing: -0.01em;
        }

        .comm-posts-count {
          font-size: 0.75rem;
          font-weight: 600;
          color: #aaa;
          background: #f5f5f5;
          padding: 4px 10px;
          border-radius: 20px;
        }

        /* ── Post ── */
        .comm-post {
          padding: 22px 24px;
          border-bottom: 1px solid #f5f5f5;
          transition: background 0.15s;
          animation: fadeUp 0.4s ease both;
        }

        .comm-post:last-child { border-bottom: none; }
        .comm-post:hover { background: #fafafa; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .comm-post:nth-child(2) { animation-delay: 0.1s; }
        .comm-post:nth-child(3) { animation-delay: 0.2s; }

        .comm-post-top {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .comm-avatar {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          object-fit: cover;
          flex-shrink: 0;
          border: 2px solid #f0f0f0;
        }

        .comm-post-meta { flex: 1; min-width: 0; }

        .comm-post-meta h6 {
          font-family: 'Syne', sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          color: #111;
          margin-bottom: 2px;
        }

        .comm-post-meta-sub {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.73rem;
          color: #bbb;
          font-weight: 500;
        }

        .comm-tag {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 6px;
          color: #fff;
          letter-spacing: 0.03em;
        }

        .comm-post-content {
          font-size: 0.88rem;
          line-height: 1.65;
          color: #444;
          margin-bottom: 14px;
        }

        .comm-post-actions {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .comm-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Mulish', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          color: #aaa;
          padding: 6px 10px;
          border-radius: 8px;
          transition: color 0.15s, background 0.15s;
        }

        .comm-action-btn:hover {
          color: #555;
          background: #f5f5f5;
        }

        .comm-action-btn.liked {
          color: #f97316;
        }

        .comm-action-btn svg {
          width: 15px;
          height: 15px;
          flex-shrink: 0;
        }

        /* ── Sidebar ── */
        .comm-sidebar { display: flex; flex-direction: column; gap: 20px; }

        /* ── Trending ── */
        .comm-trending-list { padding: 6px 0; }

        .comm-trend-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 24px;
          cursor: pointer;
          transition: background 0.15s;
        }

        .comm-trend-item:hover { background: #fafafa; }

        .comm-trend-emoji {
          font-size: 1.1rem;
          width: 34px;
          height: 34px;
          background: #f5f5f5;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .comm-trend-info { flex: 1; min-width: 0; }

        .comm-trend-info strong {
          font-family: 'Syne', sans-serif;
          font-size: 0.82rem;
          font-weight: 700;
          color: #111;
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .comm-trend-info span {
          font-size: 0.72rem;
          color: #bbb;
          font-weight: 500;
        }

        .comm-trend-arrow {
          color: #ddd;
          font-size: 0.8rem;
        }

        /* ── Online Members ── */
        .comm-online-list { padding: 6px 24px 18px; }

        .comm-online-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 0;
        }

        .comm-online-avatar-wrap {
          position: relative;
          flex-shrink: 0;
        }

        .comm-online-avatar {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          object-fit: cover;
        }

        .comm-status-dot {
          position: absolute;
          bottom: -1px;
          right: -1px;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          border: 2px solid #fff;
        }

        .comm-status-dot.online { background: #22c55e; }
        .comm-status-dot.ingame { background: #f97316; }

        .comm-online-info strong {
          font-size: 0.8rem;
          font-weight: 700;
          color: #222;
          display: block;
          font-family: 'Syne', sans-serif;
        }

        .comm-online-info span {
          font-size: 0.7rem;
          color: #bbb;
          font-weight: 500;
        }

        /* ── Stats strip ── */
        .comm-stats-strip {
          max-width: 1100px;
          margin: 0 auto 24px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .comm-stat-card {
          background: #fff;
          border: 1px solid #ebebeb;
          border-radius: 16px;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          animation: fadeUp 0.4s ease both;
        }

        .comm-stat-card:nth-child(2) { animation-delay: 0.08s; }
        .comm-stat-card:nth-child(3) { animation-delay: 0.16s; }

        .comm-stat-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .comm-stat-icon.orange { background: #fff3ea; }
        .comm-stat-icon.purple { background: #ede9fe; }
        .comm-stat-icon.green  { background: #dcfce7; }

        .comm-stat-text strong {
          font-family: 'Syne', sans-serif;
          font-size: 1.3rem;
          font-weight: 800;
          color: #111;
          display: block;
          line-height: 1;
        }

        .comm-stat-text span {
          font-size: 0.75rem;
          color: #aaa;
          font-weight: 500;
        }

        @media (max-width: 500px) {
          .comm-stats-strip { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="comm-root">

        {/* Header */}
        <div className="comm-header">
          <div className="comm-header-left">
            <h1>Com<span>munity</span></h1>
            <p>Connect · Compete · Celebrate</p>
          </div>
          <button className="comm-new-post-btn">
            <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
              <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
            </svg>
            New Post
          </button>
        </div>

        {/* Stats */}
        <div className="comm-stats-strip">
          <div className="comm-stat-card">
            <div className="comm-stat-icon orange">👥</div>
            <div className="comm-stat-text">
              <strong>12.4k</strong>
              <span>Total Members</span>
            </div>
          </div>
          <div className="comm-stat-card">
            <div className="comm-stat-icon purple">📝</div>
            <div className="comm-stat-text">
              <strong>3,891</strong>
              <span>Posts This Week</span>
            </div>
          </div>
          <div className="comm-stat-card">
            <div className="comm-stat-icon green">🟢</div>
            <div className="comm-stat-text">
              <strong>248</strong>
              <span>Online Now</span>
            </div>
          </div>
        </div>

        {/* Main layout */}
        <div className="comm-layout">

          {/* Posts */}
          <div className="comm-card">
            <div className="comm-card-header">
              <h3>Recent Posts</h3>
              <span className="comm-posts-count">3 posts</span>
            </div>
            {posts.map((post) => (
              <div key={post.id} className="comm-post">
                <div className="comm-post-top">
                  <img src={post.avatar} alt={post.name} className="comm-avatar" />
                  <div className="comm-post-meta">
                    <h6>{post.name}</h6>
                    <div className="comm-post-meta-sub">
                      <span>{post.handle}</span>
                      <span>·</span>
                      <span>{post.time}</span>
                      <span
                        className="comm-tag"
                        style={{ backgroundColor: post.tagColor }}
                      >
                        {post.tag}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="comm-post-content">{post.content}</p>
                <div className="comm-post-actions">
                  {/* Like */}
                  <button
                    className={`comm-action-btn ${liked[post.id] ? 'liked' : ''}`}
                    onClick={() => toggleLike(post.id)}
                  >
                    <svg viewBox="0 0 20 20" fill={liked[post.id] ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                    </svg>
                    {post.likes + (liked[post.id] ? 1 : 0)}
                  </button>
                  {/* Comment */}
                  <button className="comm-action-btn">
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                    {post.comments}
                  </button>
                  {/* Share */}
                  <button className="comm-action-btn">
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 12v8a1 1 0 001 1h10a1 1 0 001-1v-8M16 6l-4-4-4 4M12 2v13"/>
                    </svg>
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="comm-sidebar">

            {/* Trending */}
            <div className="comm-card">
              <div className="comm-card-header">
                <h3>🔥 Trending</h3>
              </div>
              <div className="comm-trending-list">
                {trending.map((t) => (
                  <div key={t.id} className="comm-trend-item">
                    <div className="comm-trend-emoji">{t.emoji}</div>
                    <div className="comm-trend-info">
                      <strong>{t.title}</strong>
                      <span>{t.count}</span>
                    </div>
                    <span className="comm-trend-arrow">›</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Online Members */}
            <div className="comm-card">
              <div className="comm-card-header">
                <h3>Online Now</h3>
                <span className="comm-posts-count">4 active</span>
              </div>
              <div className="comm-online-list">
                {onlineMembers.map((m, i) => (
                  <div key={i} className="comm-online-item">
                    <div className="comm-online-avatar-wrap">
                      <img src={m.avatar} alt={m.name} className="comm-online-avatar" />
                      <span className={`comm-status-dot ${m.status === 'In Game' ? 'ingame' : 'online'}`} />
                    </div>
                    <div className="comm-online-info">
                      <strong>{m.name}</strong>
                      <span>{m.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Community;