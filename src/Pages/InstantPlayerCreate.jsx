import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPlayer } from '../Services/playerService';
import "../assets/Styles/Global.css";

function InstantPlayerCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    playerName: '',
    jerseyNumber: '',
    role: 'batsman',
    teamName: '' // Optional team
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createPlayer(formData);
      alert('Player created successfully! Check the updated list →');
      navigate('/instant-player-list?refresh=1');
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating player');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-gradient-to-br from-emerald-50 to-blue-50 py-8">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-6">
            <div className="card shadow-2xl border-0">
              <div className="card-header bg-gradient-primary text-white p-5 rounded-top-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h2 className="mb-0 fw-bold">
                    <i className="fas fa-user-plus me-3"></i>
                    Instant Player Create
                  </h2>
                  <button className="btn btn-light btn-sm" onClick={() => navigate(-1)}>
                    ← Back
                  </button>
                </div>
                <p className="mb-0 opacity-75 mt-2">Quickly add custom players for your portal</p>
              </div>
              <div className="card-body p-5">
                <form onSubmit={handleSubmit}>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark">Player Name *</label>
                      <input
                        type="text"
                        className="form-control form-control-lg shadow-sm"
                        placeholder="Virat Kohli"
                        value={formData.playerName}
                        onChange={(e) => setFormData({...formData, playerName: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark">Jersey Number</label>
                      <input
                        type="number"
                        className="form-control form-control-lg shadow-sm"
                        placeholder="18"
                        min="0"
                        max="999"
                        value={formData.jerseyNumber}
                        onChange={(e) => setFormData({...formData, jerseyNumber: e.target.value})}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark">Role *</label>
                      <select
                        className="form-select form-select-lg shadow-sm"
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        required
                      >
                        <option value="batsman">Batsman</option>
                        <option value="bowler">Bowler</option>
                        <option value="all-rounder">All-rounder</option>
                        <option value="wicket-keeper">Wicket Keeper</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark">Team Name (Optional)</label>
                      <input
                        type="text"
                        className="form-control form-control-lg shadow-sm"
                        placeholder="Mumbai Indians"
                        value={formData.teamName}
                        onChange={(e) => setFormData({...formData, teamName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="d-grid mt-5">
                    <button 
                      type="submit" 
                      className="btn btn-success btn-lg fw-bold py-3 shadow-lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Creating...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-rocket me-2"></i>
                          Create Player
                        </>
                      )}
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
}

export default InstantPlayerCreate;

