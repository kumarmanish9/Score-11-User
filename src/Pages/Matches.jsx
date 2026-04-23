import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MatchCard from "../Components/MatchesSection/MatchCard";
import { getMatches } from "../Services/matchService";
import { FaFire, FaCalendarAlt, FaTrophy, FaSync, FaFilter, FaSearch,FaBaseballBall } from "react-icons/fa";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .matches-page {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
    min-height: 100vh;
    padding: 40px 0;
  }

  /* Hero Section */
  .hero-section {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    border-radius: 30px;
    padding: 50px 40px;
    margin-bottom: 40px;
    position: relative;
    overflow: hidden;
  }

  .hero-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.05"><path fill="white" d="M20,20 L30,10 L40,20 L30,30 Z M60,60 L70,50 L80,60 L70,70 Z M80,20 L90,10 L100,20 L90,30 Z"/></svg>') repeat;
    pointer-events: none;
  }

  .hero-title {
    font-size: 36px;
    font-weight: 800;
    color: white;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .hero-subtitle {
    font-size: 16px;
    color: rgba(255,255,255,0.8);
    max-width: 500px;
  }

  .live-count {
    background: #dc2626;
    color: white;
    padding: 6px 14px;
    border-radius: 30px;
    font-size: 14px;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
  }

  /* Filters Bar */
  .filters-bar {
    background: white;
    border-radius: 20px;
    padding: 16px 24px;
    margin-bottom: 30px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }

  .search-box {
    flex: 1;
    max-width: 300px;
    display: flex;
    align-items: center;
    background: #f8fafc;
    border-radius: 12px;
    padding: 10px 16px;
    gap: 10px;
    border: 1px solid #e2e8f0;
    transition: all 0.2s ease;
  }

  .search-box:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .search-icon {
    color: #94a3b8;
    font-size: 16px;
  }

  .search-input {
    border: none;
    background: none;
    outline: none;
    flex: 1;
    font-size: 14px;
    font-family: inherit;
  }

  .filter-group {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .filter-btn {
    padding: 8px 20px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 13px;
    transition: all 0.2s ease;
    cursor: pointer;
    border: 1px solid #e2e8f0;
    background: white;
    color: #64748b;
  }

  .filter-btn.active {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
    border-color: transparent;
  }

  .filter-btn:hover:not(.active) {
    background: #f8fafc;
    transform: translateY(-2px);
  }

  .refresh-btn {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 10px 20px;
    border-radius: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .refresh-btn:hover {
    background: #f1f5f9;
    transform: rotate(180deg);
  }

  /* Matches Grid */
  .matches-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 24px;
    margin-bottom: 40px;
  }

  /* Stats Cards */
  .stats-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
  }

  .stat-card {
    background: white;
    border-radius: 20px;
    padding: 24px;
    text-align: center;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  }

  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  }

  .stat-icon {
    font-size: 32px;
    margin-bottom: 12px;
  }

  .stat-value {
    font-size: 28px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 4px;
  }

  .stat-label {
    font-size: 13px;
    color: #64748b;
    font-weight: 500;
  }

  /* Loading State */
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
  }

  .custom-spinner {
    width: 50px;
    height: 50px;
    border: 3px solid rgba(59, 130, 246, 0.2);
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 20px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 80px 40px;
    background: white;
    border-radius: 30px;
  }

  .empty-icon {
    font-size: 80px;
    color: #cbd5e1;
    margin-bottom: 24px;
  }

  .empty-state h3 {
    font-size: 24px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 12px;
  }

  .empty-state p {
    color: #64748b;
    margin-bottom: 24px;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .matches-page {
      padding: 20px 0;
    }
    .hero-section {
      padding: 30px 20px;
    }
    .hero-title {
      font-size: 24px;
    }
    .matches-grid {
      grid-template-columns: 1fr;
    }
    .filters-bar {
      flex-direction: column;
      align-items: stretch;
    }
    .search-box {
      max-width: none;
    }
    .filter-group {
      justify-content: center;
    }
    .stats-container {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`;

function Matches() {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const data = await getMatches("live");
      const matchesData = data || [];
      setMatches(matchesData);
      setFilteredMatches(matchesData);
      setLastUpdated(new Date());
    } catch (error) {
      console.log("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchMatches, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterMatches();
  }, [searchTerm, filterType, matches]);

  const filterMatches = () => {
    let filtered = [...matches];
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(match => 
        match.team1?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.team2?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.tournament?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.venue?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Type filter
    if (filterType === "international") {
      filtered = filtered.filter(match => match.matchType === "international");
    } else if (filterType === "league") {
      filtered = filtered.filter(match => match.matchType === "league");
    } else if (filterType === "domestic") {
      filtered = filtered.filter(match => match.matchType === "domestic");
    }
    
    setFilteredMatches(filtered);
  };

  const getLiveCount = () => {
    return matches.filter(m => m.status === "live").length;
  };

  const getTotalOvers = () => {
    return matches.reduce((total, match) => total + (match.overs || 0), 0);
  };

  const getTotalTeams = () => {
    const teams = new Set();
    matches.forEach(match => {
      if (match.team1?._id) teams.add(match.team1._id);
      if (match.team2?._id) teams.add(match.team2._id);
    });
    return teams.size;
  };

  if (loading && matches.length === 0) {
    return (
      <>
        <style>{styles}</style>
        <div className="matches-page">
          <div className="container">
            <div className="loading-container">
              <div className="custom-spinner"></div>
              <p style={{ color: '#64748b' }}>Loading live matches...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="matches-page">
        <div className="container">
          {/* Hero Section */}
          <div className="hero-section">
            <div className="hero-title">
<FaBaseballBall size={32} style={{ color: '#fbbf24' }} />
              Live Matches
              <span className="live-count">
                <FaFire size={12} /> {getLiveCount()} LIVE
              </span>
            </div>
            <p className="hero-subtitle">
              Watch live cricket action, follow scores, and track your favorite teams
            </p>
          </div>

          {/* Stats Cards */}
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-icon">🏏</div>
              <div className="stat-value">{matches.length}</div>
              <div className="stat-label">Total Matches</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-value">{getLiveCount()}</div>
              <div className="stat-label">Live Now</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏱️</div>
              <div className="stat-value">{getTotalOvers()}</div>
              <div className="stat-label">Total Overs</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-value">{getTotalTeams()}</div>
              <div className="stat-label">Teams Playing</div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="filters-bar">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search matches, teams, tournaments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-group">
              <button
                className={`filter-btn ${filterType === "all" ? "active" : ""}`}
                onClick={() => setFilterType("all")}
              >
                All Matches
              </button>
              <button
                className={`filter-btn ${filterType === "international" ? "active" : ""}`}
                onClick={() => setFilterType("international")}
              >
                International
              </button>
              <button
                className={`filter-btn ${filterType === "league" ? "active" : ""}`}
                onClick={() => setFilterType("league")}
              >
                T20 League
              </button>
              <button
                className={`filter-btn ${filterType === "domestic" ? "active" : ""}`}
                onClick={() => setFilterType("domestic")}
              >
                Domestic
              </button>
            </div>
            
            <button className="refresh-btn" onClick={fetchMatches}>
              <FaSync size={14} /> Refresh
            </button>
          </div>

          {/* Last Updated */}
          <div className="text-end mb-3">
            <small className="text-muted">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </small>
          </div>

          {/* Matches Grid */}
          {filteredMatches.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                {searchTerm ? "🔍" : "🏏"}
              </div>
              <h3>{searchTerm ? "No matches found" : "No live matches"}</h3>
              <p>
                {searchTerm 
                  ? `No matches matching "${searchTerm}" found. Try a different search term.`
                  : "There are currently no live matches. Check back soon for live cricket action!"}
              </p>
              {searchTerm && (
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="matches-grid">
                {filteredMatches.map((match) => (
                  <MatchCard key={match._id} match={match} />
                ))}
              </div>
              
              {/* Results Count */}
              <div className="text-center mt-4">
                <p className="text-muted">
                  Showing {filteredMatches.length} of {matches.length} matches
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Matches;