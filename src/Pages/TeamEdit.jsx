import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaUserTie, FaMapMarkerAlt, FaInfoCircle, FaBuilding, FaGlobe } from 'react-icons/fa';
import { getTeamById, updateTeam } from '../Services/teamService';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .team-edit-page {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
    min-height: 100vh;
    padding: 40px 0;
  }

  /* Form Card */
  .edit-form-card {
    background: white;
    border-radius: 30px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  /* Card Header */
  .card-header-custom {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    padding: 30px 35px;
    color: white;
    position: relative;
    overflow: hidden;
  }

  .card-header-custom::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.05"><path fill="white" d="M20,20 L30,10 L40,20 L30,30 Z M60,60 L70,50 L80,60 L70,70 Z M80,20 L90,10 L100,20 L90,30 Z"/></svg>') repeat;
    pointer-events: none;
  }

  .card-header-custom h2 {
    font-size: 28px;
    font-weight: 800;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .card-header-custom p {
    font-size: 14px;
    opacity: 0.85;
    margin: 0;
  }

  /* Form Body */
  .form-body {
    padding: 35px;
  }

  /* Form Groups */
  .form-group-custom {
    margin-bottom: 24px;
  }

  .form-label-custom {
    font-size: 14px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .form-label-custom .label-icon {
    color: #3b82f6;
    font-size: 14px;
  }

  .required-star {
    color: #ef4444;
    margin-left: 4px;
  }

  .form-control-custom {
    width: 100%;
    padding: 12px 16px;
    font-size: 14px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: 2px solid #e2e8f0;
    border-radius: 14px;
    transition: all 0.2s ease;
    background: #f8fafc;
  }

  .form-control-custom:focus {
    outline: none;
    border-color: #3b82f6;
    background: white;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }

  textarea.form-control-custom {
    resize: vertical;
    min-height: 120px;
  }

  select.form-control-custom {
    cursor: pointer;
    appearance: none;
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="%2364748b"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>');
    background-repeat: no-repeat;
    background-position: right 16px center;
    background-size: 20px;
  }

  /* Row Layout */
  .form-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  /* Button Styles */
  .btn-submit {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    width: 100%;
    padding: 16px;
    border: none;
    border-radius: 16px;
    font-size: 16px;
    font-weight: 800;
    font-family: 'Plus Jakarta Sans', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: all 0.2s ease;
    margin-bottom: 12px;
  }

  .btn-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
    cursor: pointer;
  }

  .btn-submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .btn-cancel {
    background: #f1f5f9;
    color: #475569;
    width: 100%;
    padding: 16px;
    border: none;
    border-radius: 16px;
    font-size: 16px;
    font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: all 0.2s ease;
    text-decoration: none;
  }

  .btn-cancel:hover {
    background: #e2e8f0;
    transform: translateY(-2px);
    color: #1e293b;
  }

  .btn-back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: white;
    color: #475569;
    padding: 12px 24px;
    border-radius: 14px;
    text-decoration: none;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.2s ease;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .btn-back:hover {
    background: #f8fafc;
    transform: translateX(-4px);
    color: #1e293b;
  }

  /* Loading Spinner */
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .custom-spinner {
    width: 60px;
    height: 60px;
    border: 3px solid rgba(59, 130, 246, 0.2);
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Alert Styles */
  .alert-error {
    background: #fee2e2;
    border: 1px solid #fecaca;
    color: #dc2626;
    padding: 16px 24px;
    border-radius: 16px;
    font-weight: 500;
    text-align: center;
    max-width: 600px;
    margin: 40px auto;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .team-edit-page {
      padding: 20px 0;
    }
    .card-header-custom {
      padding: 20px 24px;
    }
    .card-header-custom h2 {
      font-size: 22px;
    }
    .form-body {
      padding: 24px;
    }
    .form-row {
      grid-template-columns: 1fr;
      gap: 0;
    }
  }
`;

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

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="loading-container">
          <div className="custom-spinner"></div>
          <p style={{ marginTop: 20, color: '#64748b' }}>Loading team details...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <style>{styles}</style>
        <div className="team-edit-page">
          <div className="container">
            <div className="alert-error">{error}</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="team-edit-page">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {/* Back Button */}
              <Link to={`/teams/${id}`} className="btn-back">
                <FaArrowLeft /> Back to Team
              </Link>

              {/* Form Card */}
              <div className="edit-form-card">
                <div className="card-header-custom">
                  <h2>
                    <FaSave /> Edit Team
                  </h2>
                  <p>Update your team details and information</p>
                </div>

                <div className="form-body">
                  <form onSubmit={handleSubmit}>
                    <div className="form-row">
                      <div className="form-group-custom">
                        <label className="form-label-custom">
                          <span className="label-icon">🏷️</span>
                          Team Name <span className="required-star">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          className="form-control-custom"
                          value={team.name}
                          onChange={handleChange}
                          placeholder="Enter team name"
                          required
                        />
                      </div>

                      <div className="form-group-custom">
                        <label className="form-label-custom">
                          <span className="label-icon">📝</span>
                          Short Name
                        </label>
                        <input
                          type="text"
                          name="shortName"
                          className="form-control-custom"
                          value={team.shortName}
                          onChange={handleChange}
                          placeholder="e.g., MI, CSK"
                          maxLength="10"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group-custom">
                        <label className="form-label-custom">
                          <FaUserTie className="label-icon" />
                          Coach
                        </label>
                        <input
                          type="text"
                          name="coach"
                          className="form-control-custom"
                          value={team.coach}
                          onChange={handleChange}
                          placeholder="Enter coach name"
                        />
                      </div>

                      <div className="form-group-custom">
                        <label className="form-label-custom">
                          <FaBuilding className="label-icon" />
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          className="form-control-custom"
                          value={team.city}
                          onChange={handleChange}
                          placeholder="Enter city name"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group-custom">
                        <label className="form-label-custom">
                          <FaMapMarkerAlt className="label-icon" />
                          State
                        </label>
                        <select
                          name="state"
                          className="form-control-custom"
                          value={team.state}
                          onChange={handleChange}
                        >
                          <option value="">Select State</option>
                          <option>Maharashtra</option>
                          <option>Delhi</option>
                          <option>Karnataka</option>
                          <option>Uttar Pradesh</option>
                          <option>Tamil Nadu</option>
                          <option>West Bengal</option>
                          <option>Gujarat</option>
                          <option>Rajasthan</option>
                          <option>Punjab</option>
                          <option>Haryana</option>
                        </select>
                      </div>

                      <div className="form-group-custom">
                        <label className="form-label-custom">
                          <FaGlobe className="label-icon" />
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          className="form-control-custom"
                          value={team.country}
                          onChange={handleChange}
                          placeholder="Enter country"
                        />
                      </div>
                    </div>

                    <div className="form-group-custom">
                      <label className="form-label-custom">
                        <FaInfoCircle className="label-icon" />
                        Description / Team Strategy
                      </label>
                      <textarea
                        name="description"
                        className="form-control-custom"
                        value={team.description}
                        onChange={handleChange}
                        placeholder="Tell us about your team's strategy, strengths, and goals..."
                        maxLength="1000"
                      />
                      <small style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px', display: 'block' }}>
                        {team.description?.length || 0}/1000 characters
                      </small>
                    </div>

                    <div style={{ marginTop: '32px' }}>
                      <button
                        type="submit"
                        className="btn-submit"
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <span className="custom-spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></span>
                            Saving Changes...
                          </>
                        ) : (
                          <>
                            <FaSave /> Update Team
                          </>
                        )}
                      </button>
                      <Link to={`/teams/${id}`} className="btn-cancel">
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
    </>
  );
};

export default TeamEdit;