import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// COMPONENTS
import Scorecard from "../Components/MatchDetails/Scorecard";
import BallByBall from "../Components/MatchDetails/BallByBall";
import Teams from "../Components/MatchDetails/Teams";

// SERVICES
import {
  getMatchDetails,
  getMatchTimeline,
  getLiveScore,
  getScorecard
} from '../Services/matchService';

import "../assets/Styles/Global.css";

function MatchDetails() {
  const { id } = useParams();

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('live');
  const [error, setError] = useState('');

  const [timeline, setTimeline] = useState([]);
  const [liveScore, setLiveScore] = useState(null);
  const [scorecard, setScorecard] = useState({});

  // ✅ FETCH MATCH DETAILS
  useEffect(() => {
    fetchMatch();
  }, [id]);

  const fetchMatch = async () => {
    try {
      setLoading(true);
      const data = await getMatchDetails(id);
      setMatch(data);
    } catch {
      setError('Failed to load match');
    } finally {
      setLoading(false);
    }
  };

  // ✅ LIVE SCORE (FIXED + IMPROVED)
  useEffect(() => {
    let interval;

    const fetchLive = async () => {
      const data = await getLiveScore(id).catch(() => null);

      if (data) {
        setLiveScore(prev => {
          if (JSON.stringify(prev) !== JSON.stringify(data)) {
            return data;
          }
          return prev;
        });
      }
    };

    fetchLive(); // 🔥 immediate call (no delay)

    interval = setInterval(fetchLive, 3000); // 🔥 faster refresh

    return () => clearInterval(interval);
  }, [id]);

  // ✅ TIMELINE
  const fetchTimeline = async () => {
    const data = await getMatchTimeline(id).catch(() => []);
    setTimeline(Array.isArray(data) ? data : data?.timeline || []);
  };

  // ✅ SCORECARD
  const fetchScorecard = async () => {
    const data = await getScorecard(id).catch(() => ({}));
    setScorecard(data?.scorecard || {});
  };

  // ✅ TAB BASED FETCH
  useEffect(() => {
    if (activeTab === "commentary") fetchTimeline();

    if (activeTab === "scorecard") {
      fetchScorecard();

      const interval = setInterval(fetchScorecard, 5000); // 🔥 auto refresh
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  if (loading) return <h3 className="text-center mt-5">Loading Match...</h3>;
  if (error || !match) return <h3 className="text-center mt-5">Match Not Found</h3>;

  const teamA = match?.team1 || {};
  const teamB = match?.team2 || {};

  return (
    <div className="match-details-page py-4">
      <div className="container">

        {/* 🔥 HEADER CARD */}
        <div className="card shadow-sm p-4 mb-4">
          <Link
            to={`/tournament/${match?.tournament?._id}`}
            className="btn btn-outline-primary mb-2"
          >
            {match?.tournament?.name}
          </Link>
          <h3>{teamA?.shortName || "T1"} vs {teamB?.shortName || "T2"}</h3>

          <p className="text-muted">
            {match?.venue?.name}, {match?.venue?.city}
          </p>

          <div className="row text-center mt-3">

            {/* TEAM A */}
            <div className="col-md-6">
              <h4>{teamA?.name || "Team A"}</h4>
              <h2>
                {liveScore?.score?.team1?.runs || 0}/
                {liveScore?.score?.team1?.wickets || 0}
              </h2>
              <p>{liveScore?.score?.team1?.overs || "0.0"} Ov</p>
            </div>

            {/* TEAM B */}
            <div className="col-md-6">
              <h4>{teamB?.name || "Team B"}</h4>
              <h2>
                {liveScore?.score?.team2?.runs || 0}/
                {liveScore?.score?.team2?.wickets || 0}
              </h2>
              <p>{liveScore?.score?.team2?.overs || "0.0"} Ov</p>
            </div>

          </div>

          {/* RESULT */}
          {match?.result && (
            <div className="text-center mt-3 text-success fw-bold">
              {match.result.margin}
            </div>
          )}
        </div>

        {/* 🔥 MAIN LAYOUT */}
        <div className="row">

          {/* LEFT */}
          <div className="col-lg-8">

            {/* TABS */}
            <div className="d-flex gap-3 mb-3">
              {["live", "scorecard", "commentary", "teams"].map(tab => (
                <button
                  key={tab}
                  className={`btn ${activeTab === tab ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* CONTENT */}
            <div className="card p-3 shadow-sm">

              {activeTab === "live" && (
                <div>
                  <h5>Live Updates</h5>
                  <p>Status: {match?.status}</p>
                  <p>Overs: {liveScore?.score?.team1?.overs || "0.0"}</p>
                </div>
              )}

              {activeTab === "scorecard" && (
                <Scorecard scorecard={scorecard} />
              )}

              {activeTab === "commentary" && (
                <BallByBall timeline={timeline} />
              )}

              {activeTab === "teams" && (
                <Teams teamA={teamA} teamB={teamB} />
              )}

            </div>

          </div>

          {/* RIGHT */}
          <div className="col-lg-4">

            <div className="card p-3 mb-3 shadow-sm">
              <h5>Match Officials</h5>
              <p>👨‍⚖️ Umpire: {match?.officials?.umpire || "N/A"}</p>
              <p>🧾 Scorer: {match?.officials?.scorer || "N/A"}</p>
            </div>

            <div className="card p-3 shadow-sm">
              <h5>Match Details</h5>
              <p>Format: {match?.format}</p>
              <p>Type: {match?.matchType}</p>
              <p>Status: {match?.status}</p>
            </div>

          </div>

        </div>

        {/* BACK */}
        <div className="text-center mt-4">
          <Link to="/matches" className="btn btn-primary">
            Back to Matches
          </Link>
        </div>

      </div>
    </div>
  );
}

export default MatchDetails;