import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMatch } from '../Services/matchService';
import { getAllTeams } from '../Services/teamService';
import { getTournaments } from '../Services/tournamentService';


import "../assets/Styles/Global.css";

const CreateMatch = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    team1: '',
    team2: '',
    tournament: '',
format: 't20',
    matchType: 'league',
    venue: { name: '', city: '' },
    scheduledDate: new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0], // Tomorrow
    overs: 20
  });
  const [teams, setTeams] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('📥 Fetching all teams and tournaments...');
      const [allTeamsRes, allTournaments] = await Promise.all([
        getAllTeams(),
        getTournaments()
      ]);
      const allTeams = Array.isArray(allTeamsRes) ? allTeamsRes : [];
      console.log(`✅ Loaded ${allTeams.length} teams, ${allTournaments.length} tournaments`);
      setTeams(allTeams);
      setTournaments(Array.isArray(allTournaments) ? allTournaments : []);
    } catch (err) {
      console.error('🚫 Fetch error:', err);
    }
  };


const validateForm = () => {
    const newErrors = {};
    if (!formData.team1) newErrors.team1 = 'Team 1 required';
    if (!formData.team2) newErrors.team2 = 'Team 2 required';
    if (String(formData.team1) === String(formData.team2) && formData.team1) newErrors.team2 = 'Teams must be different';
    if (!formData.scheduledDate) newErrors.scheduledDate = 'Date required';
    
    // 🔥 ObjectId format validation
    const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(String(id));
    if (formData.team1 && !isValidObjectId(formData.team1)) newErrors.team1 = 'Invalid Team 1 ID format';
    if (formData.team2 && !isValidObjectId(formData.team2)) newErrors.team2 = 'Invalid Team 2 ID format';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // 🔥 BULLETPROOF PAYLOAD VALIDATION + LOGGING
    const safePayload = {
      ...formData,
      team1: formData.team1 ? String(formData.team1).trim() : '',
      team2: formData.team2 ? String(formData.team2).trim() : '',
      tournament: formData.tournament ? String(formData.tournament).trim() : null
    };

    console.log('🚀 CREATE MATCH PAYLOAD:', JSON.stringify(safePayload, null, 2));
    
    // VALIDATE ObjectId format (24 hex chars)
    const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(String(id));
    if (!isValidObjectId(safePayload.team1) || !isValidObjectId(safePayload.team2)) {
      alert('❌ Invalid Team ID(s). Must be proper MongoDB ObjectId (24 hex chars)');
      setLoading(false);
      return;
    }
    
    try {
      const match = await createMatch(safePayload);
      console.log('✅ Match created:', match._id);
      alert(`✅ Match created successfully! ID: ${match._id}\\nView & start it from Scheduled Matches!`);
      navigate(`/scheduled-matches`);
    } catch (err) {
      console.error('❌ Match create full error:', err.response?.data || err);
      alert('❌ Create failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('venue.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({ ...prev, venue: { ...prev.venue, [field]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="min-vh-100 bg-gray-50 py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow-lg border-0">
              <div className="card-header bg-white border-0 pb-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h2 className="h4 mb-0 fw-bold text-gray-900">Create New Match ⚽</h2>
                  <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                    ← Back
                  </button>
                </div>
              </div>
              <div className="card-body p-5">
                <form onSubmit={handleSubmit}>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Team 1 *</label>
                      <select 
                        name="team1" 
                        className="form-select" 
                        value={formData.team1}
                        onChange={handleChange}
                      >
                        <option value="">Select Team 1</option>
{teams.map(team => (
                        <option key={String(team._id)} value={String(team._id)}>
                            {team.name || 'Unnamed'} ({team.shortName || 'N/A'})
                          </option>

                        ))}
                      </select>
                      {errors.team1 && <small className="text-danger">{errors.team1}</small>}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold">Team 2 *</label>
                      <select 
                        name="team2" 
                        className="form-select" 
                        value={formData.team2}
                        onChange={handleChange}
                      >
                        <option value="">Select Team 2</option>
                        {teams.map(team => (
                          <option key={String(team._id)} value={String(team._id)}>
                            {team.name || 'Unnamed'} ({team.shortName || 'N/A'})
                          </option>
                        ))}

                      </select>
                      {errors.team2 && <small className="text-danger">{errors.team2}</small>}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold">Tournament (Optional)</label>
                      <select 
                        name="tournament" 
                        className="form-select" 
                        value={formData.tournament}
                        onChange={handleChange}
                      >
                        <option value="">No Tournament</option>
                        {tournaments.map(t => (
                          <option key={t._id} value={t._id}>{t.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold">Format</label>
                      <select name="format" className="form-select" value={formData.format} onChange={handleChange}>
<option value="t20">T20 (20 overs)</option>
                        <option value="test">Test</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold">Match Date *</label>
                      <input 
                        type="date" 
                        name="scheduledDate"
                        className="form-control" 
                        value={formData.scheduledDate}
                        onChange={handleChange}
                      />
                      {errors.scheduledDate && <small className="text-danger">{errors.scheduledDate}</small>}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold">Overs per innings</label>
                      <input 
                        type="number" 
                        name="overs"
                        className="form-control" 
                        value={formData.overs}
                        min="1" max="50"
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold">Venue Name</label>
                      <input 
                        type="text" 
                        name="venue.name"
                        className="form-control" 
                        placeholder="E.g., Wankhede Stadium"
                        value={formData.venue.name}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold">City</label>
                      <input 
                        type="text" 
                        name="venue.city"
                        className="form-control" 
                        placeholder="E.g., Mumbai"
                        value={formData.venue.city}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="text-center mt-5">
                    <button 
                      type="submit" 
                      className="btn btn-success btn-lg px-5 py-3 fw-bold shadow-lg" 
                      disabled={loading}
                    >
                      {loading ? 'Creating...' : '🚀 Create Match'}
                    </button>
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

export default CreateMatch;

