import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaTh, FaList, FaUser } from "react-icons/fa";
import { AuthContext } from "../Context/AuthContext";
import { getBlogs } from "../Services/blogService";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  .bl-root {
    min-height: 100vh;
    background: #f9f9f9;
    font-family: 'DM Sans', sans-serif;
    padding: 56px 0 80px;
  }

  .bl-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 28px;
  }

  /* ── Hero heading ── */
  .bl-hero {
    text-align: center;
    margin-bottom: 48px;
  }

  .bl-hero-eyebrow {
    display: inline-block;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #aaa;
    margin-bottom: 14px;
    padding: 4px 14px;
    border-radius: 20px;
    background: #f0f0f0;
    border: 1px solid #e8e8e8;
  }

  .bl-hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(32px, 5vw, 56px);
    font-weight: 900;
    color: #111;
    margin: 0 0 14px;
    letter-spacing: -1.5px;
    line-height: 1.05;
  }

  .bl-hero h1 em {
    font-style: italic;
    color: #888;
  }

  .bl-hero p {
    font-size: 15px;
    color: #aaa;
    max-width: 480px;
    margin: 0 auto;
    line-height: 1.6;
    font-weight: 400;
  }

  /* ── Controls bar ── */
  .bl-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 32px;
    flex-wrap: wrap;
  }

  .bl-search {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #fff;
    border: 1.5px solid #efefef;
    border-radius: 14px;
    padding: 10px 16px;
    flex: 1;
    max-width: 400px;
    box-shadow: 0 1px 8px rgba(0,0,0,0.04);
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .bl-search:focus-within {
    border-color: #ccc;
    box-shadow: 0 0 0 3px rgba(0,0,0,0.04);
  }

  .bl-search svg { color: #ccc; font-size: 13px; flex-shrink: 0; }

  .bl-search input {
    border: none;
    outline: none;
    background: transparent;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: #333;
    width: 100%;
  }

  .bl-search input::placeholder { color: #bbb; }

  .bl-right-controls {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .bl-count {
    font-size: 12px;
    font-weight: 600;
    color: #bbb;
    white-space: nowrap;
  }

  .bl-count span {
    color: #333;
    font-weight: 700;
  }

  /* View toggle */
  .bl-toggle {
    display: flex;
    background: #f5f5f5;
    border-radius: 10px;
    padding: 3px;
    gap: 3px;
  }

  .bl-toggle-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #bbb;
    font-size: 13px;
    transition: background 0.15s, color 0.15s;
  }

  .bl-toggle-btn.active {
    background: #fff;
    color: #111;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  }

  /* ── Error ── */
  .bl-error {
    background: #fff9f0;
    border: 1.5px solid #fde68a;
    border-radius: 14px;
    padding: 14px 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 24px;
    font-size: 13px;
    color: #92400e;
  }

  .bl-retry {
    background: #f5c500;
    border: none;
    border-radius: 8px;
    padding: 6px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 700;
    color: #111;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.15s;
  }

  .bl-retry:hover { background: #e6b800; }

  /* ── Grid layout ── */
  .bl-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
    gap: 18px;
  }

  /* ── List layout ── */
  .bl-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* ── Blog card (grid) ── */
  .bl-card {
    background: #fff;
    border-radius: 20px;
    border: 1.5px solid #efefef;
    overflow: hidden;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  }

  .bl-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.10);
    border-color: #e0e0e0;
  }

  .bl-card-img-wrap {
    position: relative;
    height: 190px;
    overflow: hidden;
    background: #f5f5f5;
    flex-shrink: 0;
  }

  .bl-card-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
    display: block;
  }

  .bl-card:hover .bl-card-img-wrap img {
    transform: scale(1.06);
  }

  .bl-card-date {
    position: absolute;
    bottom: 10px;
    left: 12px;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(6px);
    border-radius: 8px;
    padding: 4px 10px;
    font-size: 11px;
    font-weight: 700;
    color: #555;
    border: 1px solid rgba(255,255,255,0.6);
  }

  .bl-card-no-img {
    height: 190px;
    background: linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    flex-shrink: 0;
  }

  .bl-card-body {
    padding: 18px 18px 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .bl-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 16px;
    font-weight: 700;
    color: #111;
    margin: 0;
    line-height: 1.3;
    letter-spacing: -0.2px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .bl-card-excerpt {
    font-size: 13px;
    color: #aaa;
    margin: 0;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex: 1;
  }

  .bl-card-footer {
    display: flex;
    align-items: center;
    gap: 7px;
    padding-top: 10px;
    border-top: 1px solid #f5f5f5;
    margin-top: auto;
  }

  .bl-card-avatar {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #f0f0f0;
    border: 1px solid #e8e8e8;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    color: #bbb;
    flex-shrink: 0;
  }

  .bl-card-author {
    font-size: 12px;
    font-weight: 500;
    color: #bbb;
  }

  /* ── Blog row (list) ── */
  .bl-row {
    background: #fff;
    border-radius: 16px;
    border: 1.5px solid #efefef;
    overflow: hidden;
    text-decoration: none;
    display: flex;
    align-items: stretch;
    gap: 0;
    transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }

  .bl-row:hover {
    transform: translateX(4px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.08);
    border-color: #e0e0e0;
  }

  .bl-row-img {
    width: 120px;
    flex-shrink: 0;
    overflow: hidden;
    background: #f5f5f5;
  }

  .bl-row-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.3s;
  }

  .bl-row:hover .bl-row-img img { transform: scale(1.06); }

  .bl-row-no-img {
    width: 120px;
    flex-shrink: 0;
    background: linear-gradient(135deg,#f8f8f8,#f0f0f0);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
  }

  .bl-row-body {
    flex: 1;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
    min-width: 0;
  }

  .bl-row-title {
    font-family: 'Playfair Display', serif;
    font-size: 15px;
    font-weight: 700;
    color: #111;
    margin: 0;
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .bl-row-excerpt {
    font-size: 12px;
    color: #aaa;
    margin: 0;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .bl-row-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 2px;
  }

  .bl-row-author {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    color: #ccc;
    font-weight: 500;
  }

  .bl-row-date {
    font-size: 11px;
    color: #ddd;
    font-weight: 500;
  }

  /* ── Empty ── */
  .bl-empty {
    text-align: center;
    padding: 64px 0;
    color: #ccc;
  }

  .bl-empty-icon {
    font-size: 44px;
    display: block;
    margin-bottom: 14px;
    opacity: 0.4;
  }

  .bl-empty h3 {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    color: #ccc;
    margin: 0 0 8px;
    font-weight: 700;
  }

  .bl-empty p {
    font-size: 13px;
    color: #ddd;
    margin: 0;
  }

  /* ── Loading ── */
  .bl-loading {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    flex-direction: column;
    gap: 14px;
    background: #f9f9f9;
  }

  .bl-spinner {
    width: 36px;
    height: 36px;
    border: 3px solid #f0f0f0;
    border-top-color: #111;
    border-radius: 50%;
    animation: bl-spin 0.8s linear infinite;
  }

  @keyframes bl-spin { to { transform: rotate(360deg); } }

  .bl-loading p {
    font-size: 13px;
    color: #bbb;
    margin: 0;
  }

  /* ── Pagination ── */
  .bl-pagination {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin-top: 48px;
    flex-wrap: wrap;
  }

  .bl-page-btn {
    min-width: 38px;
    height: 38px;
    border-radius: 10px;
    border: 1.5px solid #efefef;
    background: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #888;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 12px;
    transition: border-color 0.15s, color 0.15s, background 0.15s, transform 0.12s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }

  .bl-page-btn:hover:not(.active) {
    border-color: #ddd;
    color: #111;
    transform: translateY(-1px);
  }

  .bl-page-btn.active {
    background: #111;
    border-color: #111;
    color: #fff;
  }

  /* stagger animation */
  .bl-card, .bl-row {
    animation: bl-fadein 0.3s ease both;
  }

  @keyframes bl-fadein {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0);    }
  }

  @media (max-width: 600px) {
    .bl-controls { flex-direction: column; align-items: stretch; }
    .bl-search { max-width: 100%; }
    .bl-right-controls { justify-content: space-between; }
    .bl-grid { grid-template-columns: 1fr; }
  }
`;

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });

const Blogs = () => {
  const [blogs, setBlogs]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode]     = useState("grid");
  const { user }                    = useContext ? useContext(require("../Context/AuthContext").AuthContext) : {};

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await getBlogs();
      setBlogs(data);
      setError("");
    } catch (err) {
      setError("Failed to load blogs. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.author?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="bl-loading">
          <div className="bl-spinner" />
          <p>Loading blogs...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="bl-root">
        <div className="bl-container">

          {/* Hero */}
          <div className="bl-hero">
            <span className="bl-hero-eyebrow">🏏 Score11 Journal</span>
            <h1>Cricket Blogs &amp; <em>Insights</em></h1>
            <p>Latest news, analysis, tips, and stories from the world of cricket</p>
          </div>

          {/* Controls */}
          <div className="bl-controls">
            <div className="bl-search">
              <FaSearch />
              <input
                type="text"
                placeholder="Search blogs, players, matches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="bl-right-controls">
              <span className="bl-count">
                <span>{filteredBlogs.length}</span> articles
              </span>
              <div className="bl-toggle">
                <button
                  className={`bl-toggle-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  title="Grid view"
                >
                  <FaTh />
                </button>
                <button
                  className={`bl-toggle-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                  title="List view"
                >
                  <FaList />
                </button>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bl-error">
              <span>⚠️ {error}</span>
              <button className="bl-retry" onClick={fetchBlogs}>Retry</button>
            </div>
          )}

          {/* Empty */}
          {filteredBlogs.length === 0 ? (
            <div className="bl-empty">
              <span className="bl-empty-icon">📭</span>
              <h3>No blogs found</h3>
              <p>Try adjusting your search or check back later</p>
            </div>
          ) : viewMode === "grid" ? (
            /* Grid */
            <div className="bl-grid">
              {filteredBlogs.map((blog, i) => (
                <Link
                  to={`/blog/${blog._id}`}
                  className="bl-card"
                  key={blog._id}
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  {blog.image ? (
                    <div className="bl-card-img-wrap">
                      <img src={blog.image} alt={blog.title} />
                      <span className="bl-card-date">{formatDate(blog.createdAt)}</span>
                    </div>
                  ) : (
                    <div className="bl-card-no-img">🏏</div>
                  )}
                  <div className="bl-card-body">
                    <p className="bl-card-title">{blog.title}</p>
                    <p className="bl-card-excerpt">
                      {blog.excerpt || blog.content?.substring(0, 150) + "…"}
                    </p>
                    <div className="bl-card-footer">
                      <div className="bl-card-avatar"><FaUser /></div>
                      <span className="bl-card-author">{blog.author?.name || "Score11 Team"}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* List */
            <div className="bl-list">
              {filteredBlogs.map((blog, i) => (
                <Link
                  to={`/blog/${blog._id}`}
                  className="bl-row"
                  key={blog._id}
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  {blog.image ? (
                    <div className="bl-row-img">
                      <img src={blog.image} alt={blog.title} />
                    </div>
                  ) : (
                    <div className="bl-row-no-img">🏏</div>
                  )}
                  <div className="bl-row-body">
                    <p className="bl-row-title">{blog.title}</p>
                    <p className="bl-row-excerpt">
                      {blog.excerpt || blog.content?.substring(0, 120) + "…"}
                    </p>
                    <div className="bl-row-meta">
                      <span className="bl-row-author">
                        <FaUser style={{ fontSize: 10 }} />
                        {blog.author?.name || "Score11 Team"}
                      </span>
                      <span className="bl-row-date">{formatDate(blog.createdAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {filteredBlogs.length > 0 && (
            <div className="bl-pagination">
              <button className="bl-page-btn">← Prev</button>
              <button className="bl-page-btn active">1</button>
              <button className="bl-page-btn">2</button>
              <button className="bl-page-btn">3</button>
              <button className="bl-page-btn">Next →</button>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Blogs;