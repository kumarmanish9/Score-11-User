import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMatchDetails } from '../Services/matchService';
import "../assets/Styles/Global.css";

function MatchDetails() {
  const { id } = useParams();

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('scorecard');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMatch();
  }, [id]);

  const fetchMatch = async () => {
    try {
      setLoading(true);
      const data = await getMatchDetails(id);
      console.log("Match Details API:", data);
      setMatch(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load match details');
    } finally {
      setLoading(false);
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

  // ✅ Teams Fix
  const teamA = match?.team1 || match?.teamA || {};
  const teamB = match?.team2 || match?.teamB || {};

  return (
    <div className="py-5 min-vh-100">
      <div className="container">

        {/* ✅ HEADER */}
        <div className="text-center mb-4">
          <h2>
            {teamA?.name || teamA?.shortName || "Team A"} vs{" "}
            {teamB?.name || teamB?.shortName || "Team B"}
          </h2>

          <p>Status: {match?.status}</p>

          <p>
            {match?.venue
              ? `${match.venue.name}, ${match.venue.city}, ${match.venue.country}`
              : "Venue not available"}
          </p>
        </div>

        {/* ✅ SCORE SECTION (FIXED) */}
        <div className="row text-center mb-5">

          {/* TEAM 1 */}
          <div className="col-md-6">
            <h3>{teamA?.name || "Team A"}</h3>

            <h2>
              {match?.score?.team1?.runs || 0}/
              {match?.score?.team1?.wickets || 0}
            </h2>

            <p>{match?.score?.team1?.overs || "0.0"} overs</p>
          </div>

          {/* TEAM 2 */}
          <div className="col-md-6">
            <h3>{teamB?.name || "Team B"}</h3>

            <h2>
              {match?.score?.team2?.runs || 0}/
              {match?.score?.team2?.wickets || 0}
            </h2>

            <p>{match?.score?.team2?.overs || "0.0"} overs</p>
          </div>

        </div>

        {/* ✅ RESULT (NEW 🔥) */}
        {match?.result && (
          <div className="text-center mb-4">
            <p className="text-success fw-bold">
              Result: {match?.result?.margin}
            </p>
            <p>
              Player of Match: {match?.result?.playerOfMatch?.playerName}
            </p>
          </div>
        )}

        {/* ✅ TABS */}
        <div className="text-center mb-4">
          <button onClick={() => setActiveTab('scorecard')}>Scorecard</button>
          <button onClick={() => setActiveTab('ball')}>Ball-by-Ball</button>
          <button onClick={() => setActiveTab('teams')}>Teams</button>
        </div>

        {/* ✅ SCORECARD */}
        {activeTab === 'scorecard' && (
          <div>
            <h4>Scorecard Coming from API next step</h4>
          </div>
        )}

        {/* ✅ BALL BY BALL */}
        {activeTab === 'ball' && (
          <div>
            <h4>Live Commentary (Next Step)</h4>
          </div>
        )}

        {/* ✅ TEAMS */}
        {activeTab === 'teams' && (
          <div>
            <h4>Teams Info (Next Step)</h4>
          </div>
        )}

        {/* ACTION */}
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