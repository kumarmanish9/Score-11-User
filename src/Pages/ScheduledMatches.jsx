import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Components/PagesCss/Matches.css";
import MatchCard from "../Components/MatchesSection/MatchCard";
import { getAllMatchesWithFilter, updateMatchStatus } from "../Services/matchService";
import { FaCalendarCheck, FaPlay, FaArrowLeft } from "react-icons/fa";

function ScheduledMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchScheduledMatches = async () => {
    try {
      setLoading(true);
      console.log('Fetching scheduled matches with status filter...');
      const data = await getAllMatchesWithFilter('scheduled');
      const scheduled = (data || []).filter(m => m.status === 'scheduled');
      console.log('Raw data:', data?.length, 'Filtered scheduled:', scheduled.length);
      setMatches(scheduled);
    } catch (error) {
      console.error("Error fetching scheduled matches:", error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };


  const handleStartMatch = async (match) => {
    if (!confirm(`Start match: ${match.team1?.name || 'Team1'} vs ${match.team2?.name || 'Team2'}?\n\nNote: Use Live Control screen for full scoring setup.`)) return;
    try {
      await updateMatchStatus(match._id, 'ready');
      navigate(`/match/${match._id}/toss`);
    } catch (error) {
      console.error('Start match error:', error);
      alert('Start match initiated! Navigate to Live Control for scoring.\n\nError details: ' + (error.message || error.response?.data?.message || 'Unknown error'));
    }
  };

  useEffect(() => {
    fetchScheduledMatches();
  }, []);

  return (
    <div className="matches-page">
      <div className="page-header" style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem'}}>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/dashboard')}>
          <FaArrowLeft /> Back
        </button>
        <h2 className="page-title">📅 Scheduled Matches ({matches.length})</h2>
        <button className="btn btn-primary" onClick={() => navigate('/create-match')}>
          <FaCalendarCheck /> Create Match
        </button>
      </div>

      <div className="matches-container">
        {loading ? (
          <p className="loading">Loading scheduled matches...</p>
        ) : matches.length === 0 ? (
          <div style={{textAlign: 'center', padding: '4rem'}}>
            <FaCalendarCheck size={64} style={{opacity: 0.5, marginBottom: '1rem'}} />
            <h4>No Scheduled Matches</h4>
            <p>Create your first match to get started!</p>
            <button className="btn btn-success" onClick={() => navigate('/create-match')}>
              Create Match
            </button>
          </div>
        ) : (
          matches.map((match) => (
            <div key={match._id} style={{position: 'relative'}}>
              <MatchCard match={match} />
              <div className="position-absolute top-0 end-0 m-2" style={{zIndex: 10}}>
                <button className="btn btn-success" onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/match/${match._id}/live-control`);
                }}>
                  <FaPlay /> Go Live Control
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ScheduledMatches;

