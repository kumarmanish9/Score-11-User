import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// ✅ COMPONENTS
import Scorecard from "../Components/MatchDetails/Scorecard";
import BallByBall from "../Components/MatchDetails/BallByBall";
import Teams from "../Components/MatchDetails/Teams";

// ✅ SERVICES
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
  const [activeTab, setActiveTab] = useState('scorecard');
  const [error, setError] = useState('');

  const [timeline, setTimeline] = useState([]);
  const [timelineLoading, setTimelineLoading] = useState(false);

  const [liveScore, setLiveScore] = useState(null);

  // 🔥 IMPORTANT FIX → should be object, not array
  const [scorecard, setScorecard] = useState({});
  const [scorecardLoading, setScorecardLoading] = useState(false);

  // ✅ Fetch Match
  useEffect(() => {
    fetchMatch();
  }, [id]);

  // ✅ Fetch Timeline
  useEffect(() => {
    if (activeTab === "ball") {
      fetchTimeline();
    }
  }, [activeTab]);

  // ✅ Fetch Scorecard
  useEffect(() => {
    if (activeTab === "scorecard") {
      fetchScorecard();
    }
  }, [activeTab]);

  // ✅ Live Score Polling
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const data = await getLiveScore(id);
        setLiveScore(data);
      } catch (err) {
        console.error("Live score error:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  const fetchMatch = async () => {
    try {
      setLoading(true);
      const data = await getMatchDetails(id);
      setMatch(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load match details');
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeline = async () => {
    try {
      setTimelineLoading(true);
      const data = await getMatchTimeline(id);

      // 🔥 SAFE FIX
      setTimeline(Array.isArray(data) ? data : data?.timeline || []);
    } catch (err) {
      console.error("Timeline error:", err);
      setTimeline([]);
    } finally {
      setTimelineLoading(false);
    }
  };

  const fetchScorecard = async () => {
    try {
      setScorecardLoading(true);
      const data = await getScorecard(id);

      // 🔥 SAFE FIX
      setScorecard(data?.scorecard || {});
    } catch (err) {
      console.error("Scorecard error:", err);
      setScorecard({});
    } finally {
      setScorecardLoading(false);
    }
  };

  // ✅ Loading
  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <h3>Loading Match...</h3>
      </div>
    );
  }

  // ✅ Error
  if (error || !match) {
    return (
      <div className="text-center p-5">
        <h2>Match Not Found</h2>
        <Link to="/matches" className="btn btn-primary">All Matches</Link>
      </div>
    );
  }

  const teamA = match?.team1 || {};
  const teamB = match?.team2 || {};

  // ✅ Player Map
  const allPlayers = [...(teamA.players || []), ...(teamB.players || [])];
  const playerMap = {};
  allPlayers.forEach(p => {
    playerMap[p._id] = p.name;
  });

  // ✅ Team Map
  const teamMap = {
    [teamA?._id]: teamA?.name,
    [teamB?._id]: teamB?.name
  };

  return (
    <div className="py-5 min-vh-100">
      <div className="container">

        {/* HEADER */}
        <div className="text-center mb-4">
          <h2>{teamA?.shortName} vs {teamB?.shortName}</h2>
          <p>Status: {match?.status}</p>
          <p>{match?.venue?.name}, {match?.venue?.city}</p>
        </div>

        {/* LIVE SCORE */}
        <div className="row text-center mb-5">
          <div className="col-md-6">
            <h3>{teamA?.name}</h3>
            <h2>
              {liveScore?.team1?.runs || match?.score?.team1?.runs || 0}/
              {liveScore?.team1?.wickets || match?.score?.team1?.wickets || 0}
            </h2>
            <p>{liveScore?.team1?.overs || match?.score?.team1?.overs || "0.0"} overs</p>
          </div>

          <div className="col-md-6">
            <h3>{teamB?.name}</h3>
            <h2>
              {liveScore?.team2?.runs || match?.score?.team2?.runs || 0}/
              {liveScore?.team2?.wickets || match?.score?.team2?.wickets || 0}
            </h2>
            <p>{liveScore?.team2?.overs || match?.score?.team2?.overs || "0.0"} overs</p>
          </div>
        </div>

        {/* RESULT */}
        {match?.result && (
          <div className="text-center mb-4">
            <p className="text-success fw-bold">
              Result: {match?.result?.margin}
            </p>
            <p>Player of Match: {match?.result?.playerOfMatch?.playerName}</p>
          </div>
        )}

        {/* TABS */}
        <div className="text-center mb-4">
          <button onClick={() => setActiveTab('scorecard')}>Scorecard</button>
          <button onClick={() => setActiveTab('ball')}>Ball-by-Ball</button>
          <button onClick={() => setActiveTab('teams')}>Teams</button>
        </div>

        {/* COMPONENTS */}

        {activeTab === 'scorecard' && (
          <Scorecard
            scorecard={scorecard}
            loading={scorecardLoading}
            teamMap={teamMap}
            playerMap={playerMap}
          />
        )}

        {activeTab === 'ball' && (
          <BallByBall
            timeline={timeline}
            loading={timelineLoading}
          />
        )}

        {activeTab === 'teams' && (
          <Teams
            teamA={teamA}
            teamB={teamB}
            playerMap={playerMap}
          />
        )}

        {/* BACK */}
        <div className="text-center mt-5">
          <Link to="/matches" className="btn btn-primary">
            Back to Matches
          </Link>
        </div>

      </div>
    </div>
  );
}

export default MatchDetails;