import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { getTeamById, updateTeam } from '../Services/teamService';
import "../assets/Styles/Global.css";

const TeamEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState({
    name: '',
    shortName: '',
    coach: '',
    description: '',
    city: '',
    state: '',
    country: 'India'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTeam();
  }, [id]);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const data = await getTeamById(id);
      setTeam({
        name: data.name || '',
        shortName: data.shortName || '',
        coach: data.coach || '',
        description: data.description || '',
        city: data.city || '',
        state: data.state || '',
        country: data.country || 'India'
      });
    } catch (err) {
      setError('Failed to load team');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateTeam(id, team);
      alert('Team updated successfully!');
      navigate(`/teams/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setTeam({ ...team, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="min-vh-100 d-flex align-items-center justify-content-center"><div className="spinner-border text-primary fs-1" /></div>;
  if (error) return <div className="alert alert-danger text-center mt-5">{error}</div>;

  return (
    <div className="py-5 bg-gradient-light min-vh-100">
      <div className="container">
        <Link to={`/teams/${id}`} className="btn btn-outline-secondary mb-4">
          <FaArrowLeft className="me-2" /> Back to Team
        </Link>
        
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-xl border-0">
              <div className="card-header bg-gradient-primary text-white p-5 rounded-top-3">
                <h2 className="mb-0 fw-bold">
                  <FaSave className="me-3" />
                  Edit Team
                </h2>
                <p className="mb-0 opacity-75 mt-2">Update your team details</p>
              </div>
              <div className="card-body p-5">
                <form onSubmit={handleSubmit}>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark">Team Name *</label>
                      <input
                        name="name"
                        className="form-control form-control-lg shadow-sm"
                        value={team.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark">Short Name</label>
                      <input
                        name="shortName"
                        className="form-control form-control-lg shadow-sm"
                        value={team.shortName}
                        onChange={handleChange}
                        maxLength="10"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark">Coach</label>
                      <input
                        name="coach"
                        className="form-control form-control-lg shadow-sm"
                        value={team.coach}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark">City</label>
                      <input
                        name="city"
                        className="form-control form-control-lg shadow-sm"
                        value={team.city}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark">State</label>
                      <select name="state" className="form-select form-select-lg shadow-sm" value={team.state} onChange={handleChange}>
                        <option>Maharashtra</option>
                        <option>Delhi</option>
                        <option>Karnataka</option>
                        <option>Uttar Pradesh</option>
                        <option>Tamil Nadu</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark">Country</label>
                      <input name="country" className="form-control form-control-lg shadow-sm" value={team.country} onChange={handleChange} />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-bold text-dark">Description</label>
                      <textarea
                        name="description"
                        className="form-control shadow-sm"
                        rows="4"
                        value={team.description}
                        onChange={handleChange}
                        maxLength="1000"
                      />
                    </div>
                  </div>
                  <div className="d-grid mt-5 gap-2">
                    <button type="submit" className="btn btn-success btn-lg fw-bold py-3 shadow-lg" disabled={saving}>
                      {saving ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaSave className="me-2" />
                          Update Team
                        </>
                      )}
                    </button>
                    <Link to={`/teams/${id}`} className="btn btn-outline-secondary py-3">
                      Cancel
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamEdit;

