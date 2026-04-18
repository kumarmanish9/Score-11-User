import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMatchDetails, updateToss, updateMatchStatus } from '../Services/matchService';
import { getTeamById } from '../Services/teamService';
import "../assets/Styles/Global.css";

const TossScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tossData, setTossData] = useState({ winner: '', decision: 'bat' });
  const [team1, setTeam1] = useState(null);
  const [team2, setTeam2] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) fetchMatch();
  }, [id]);

  const fetchMatch = async () => {
    try {
      const matchData = await getMatchDetails(id);
      setMatch(matchData);
      
      // Fetch teams
      const [t1, t2] = await Promise.all([
        getTeamById(matchData.team1._id),
        getTeamById(matchData.team2._id)
      ]);
      setTeam1(t1);
      setTeam2(t2);
    } catch (err) {
      alert('Match not found');
      navigate('/matches');
    } finally {
      setLoading(false);
    }
  };

  const handleTossSubmit = async () => {
    if (!tossData.winner) {
      alert('Select toss winner');
      return;
    }

    setSubmitting(true);
    try {
      // Update toss
      const updatedMatch = await updateToss(id, tossData);
      
      // Go to team selection instead of live
      alert(`✅ Toss won by ${tossData.winner === match.team1._id ? team1.name : team2.name} - ${tossData.decision.toUpperCase()} first!`);
      navigate(`/match/${id}/team-select`);
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center p-5">Loading match...</div>;
  if (!match) return <div className="text-center p-5">Match not found</div>;

  return (
    <div className="min-vh-100 bg-gradient-to-br from-indigo-50 to-blue-50 py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-xl border-0">
              <div className="card-body p-5 text-center">
                <div className="mb-5">
                  <h1 className="display-4 fw-bold text-primary mb-3">🪙 TOSS TIME!</h1>
                  <p className="lead text-muted mb-4">
                    {team1?.name || 'Team 1'} vs {team2?.name || 'Team 2'}
                  </p>
                  <div className="row g-4 mb-5">
                    <div className="col-md-6">
                      <h3>{team1?.name}</h3>
                      <img src={team1?.logo?.url} alt={team1?.name} className="img-fluid rounded shadow" style={{maxHeight: '150px'}} />
                    </div>
                    <div className="col-md-6">
                      <h3>{team2?.name}</h3>
                      <img src={team2?.logo?.url} alt={team2?.name} className="img-fluid rounded shadow" style={{maxHeight: '150px'}} />
                    </div>
                  </div>
                </div>

                <div className="row g-4">
                  <div className="col-md-6">
                    <h5 className="fw-bold mb-3">Toss Winner</h5>
                    <div className="d-grid gap-2">
                      <button 
                        type="button"
                        className={`btn py-4 fw-bold ${tossData.winner === match.team1._id ? 'btn-primary shadow-lg' : 'btn-outline-primary'}`}
                        onClick={() => setTossData(prev => ({ ...prev, winner: match.team1._id }))}
                      >
                        {team1?.name || 'Team 1'} Wins Toss
                      </button>
                      <button 
                        type="button"
                        className={`btn py-4 fw-bold ${tossData.winner === match.team2._id ? 'btn-primary shadow-lg' : 'btn-outline-primary'}`}
                        onClick={() => setTossData(prev => ({ ...prev, winner: match.team2._id }))}
                      >
                        {team2?.name || 'Team 2'} Wins Toss
                      </button>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <h5 className="fw-bold mb-3">Decision</h5>
                    <div className="d-grid gap-3">
                      <button 
                        type="button"
                        className={`btn py-4 fw-bold border-3 ${tossData.decision === 'bat' ? 'btn-success shadow-lg' : 'btn-outline-success'}`}
                        onClick={() => setTossData(prev => ({ ...prev, decision: 'bat' }))}
                      >
                        🏏 Bat First
                      </button>
                      <button 
                        type="button"
                        className={`btn py-4 fw-bold border-3 ${tossData.decision === 'bowl' ? 'btn-warning shadow-lg' : 'btn-outline-warning'}`}
                        onClick={() => setTossData(prev => ({ ...prev, decision: 'bowl' }))}
                      >
                        🏏 Bowl First
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-top">
                  <button 
                    className="btn btn-success btn-lg px-6 py-3 fw-bold shadow-lg w-100" 
                    onClick={handleTossSubmit}
                    disabled={submitting || !tossData.winner}
                  >
                    {submitting ? 'Starting Match...' : '🚀 START MATCH'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TossScreen;

