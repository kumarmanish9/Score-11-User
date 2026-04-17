import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUsers, FaCrown, FaStar, FaEdit, FaTrash } from 'react-icons/fa';
import { getTeamById, deleteTeam } from '../Services/teamService';
import "../assets/Styles/Global.css";

const TeamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTeam();
  }, [id]);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const data = await getTeamById(id);
      setTeam(data);
    } catch (err) {
      setError('Failed to load team');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this team?')) {
      try {
        await deleteTeam(id);
        navigate('/teams?refresh=1');
      } catch (err) {
        alert('Error deleting team');
      }
    }
  };

  if (loading) return <div className="min-vh-100 d-flex align-items-center justify-content-center"><div className="spinner-border text-primary fs-1" /></div>;
  if (error || !team) return <div className="alert alert-danger text-center mt-5">Team not found</div>;

  return (
    <div className="py-5 bg-gradient-light min-vh-100">
      <div className="container">
        <div className="card shadow-xl border-0 mb-5">
          <div className="card-body p-5 text-center">
            {team.logo?.url && <img src={team.logo.url} alt={team.name} className="rounded-circle mb-3" style={{width: '120px', height: '120px'}} />}
            <h1 className="display-5 fw-bold mb-2">{team.name}</h1>
            <p className="lead text-muted mb-1">{team.shortName}</p>
            <p className="text-muted mb-0">by {team.owner?.name}</p>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card shadow-lg border-0">
              <div className="card-header bg-primary text-white py-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h3 className="mb-0"><FaUsers className="me-2" />Team Lineup ({team.players?.length || 0}/25)</h3>
                  <div>
                    <span className="badge bg-light text-dark me-2">Points: {team.points || 0}</span>
                    {team.status && <span className={`badge fs-6 ${team.status === 'active' ? 'bg-success' : 'bg-warning'}`}>{team.status.toUpperCase()}</span>}
                  </div>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="row g-3 p-4">
                  {team.players?.map((player, index) => (
                    <div key={player._id} className="col-md-4 col-lg-3">
                      <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body text-center py-4">
                          <div className={`mb-2 ${index < 1 ? 'text-warning' : index < 3 ? 'text-info' : ''}`}>
                            {index === 0 && <FaCrown className="fs-4" title="Captain" />}
                            {index === 1 && <FaStar className="fs-4" title="Vice-Captain" />}
                          </div>
                          <strong>{player.playerName}</strong>
                          <div className="badge bg-secondary mt-1">{player.role}</div>
                          <div className="small text-muted mt-1">#{player.jerseyNumber || 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card shadow-lg border-0 h-100">
              <div className="card-header bg-success text-white py-4">
                <h5 className="mb-0"><FaCrown className="me-2" />Leadership</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <strong>Captain:</strong> {team.captain?.playerName || 'Not set'}
                </div>
                <div className="mb-4">
                  <strong>Vice-Captain:</strong> {team.viceCaptain?.playerName || 'Not set'}
                </div>
                <div className="mb-3">
                  <strong>Coach:</strong> {team.coach || 'TBD'}
                </div>
                <div className="mb-3">
                  <strong>Location:</strong> {team.city}, {team.state}
                </div>
                {team.description && (
                  <div className="mt-3">
                    <strong>Strategy:</strong>
                    <p className="text-muted small mt-1">{team.description}</p>
                  </div>
                )}
              </div>
              <div className="card-footer bg-light border-0 pt-0">
                <div className="d-grid gap-2">
                  <Link to={`/teams/${id}/edit`} className="btn btn-primary"><FaEdit className="me-2" />Edit Team</Link>
                  <button onClick={handleDelete} className="btn btn-outline-danger"><FaTrash className="me-2" />Delete Team</button>
                  <Link to="/teams" className="btn btn-outline-secondary">← Back to Teams</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;

