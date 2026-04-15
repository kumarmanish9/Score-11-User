import React, { useEffect, useState, useContext, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { getMyProfile, updateMyProfile, uploadProfileAvatar } from "../Services/playerProfileService";
import { FaUsers, FaTrophy, FaWallet, FaPlus, FaCrown, FaEdit, FaSave, FaTimes, FaImage, FaCamera, FaCheckCircle, FaEnvelope, FaPhoneAlt, FaUser } from "react-icons/fa";
import ProfileHeader from "../Components/ProfileSection/ProfileHeader";
import StatsSection from "../Components/ProfileSection/StatsSection";
import PerformanceSection from "../Components/ProfileSection/PerformanceSection";
import "../assets/Styles/Global.css";

function Profile() {
  const { user: authUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (!authUser) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, [authUser]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profileRes = await getMyProfile().catch(() => ({ data: { data: null } }));
      
      setProfile(profileRes.data?.data || {
        ...authUser,
        cricketProfile: { matchesPlayed: 0, totalRuns: 0, totalWickets: 0, highestScore: 0 },
        teams: [],
        stats: { matchesWon: 0, matchesLost: 0, tournamentsWon: 0, manOfTheMatch: 0 }
      });
      setEditForm({}); // Reset form
    } catch (error) {
      console.error("Profile error:", error);
      setProfile({
        ...authUser,
        cricketProfile: { matchesPlayed: 0, totalRuns: 0, totalWickets: 0, highestScore: 0 },
        teams: [],
        stats: { matchesWon: 0, matchesLost: 0, tournamentsWon: 0, manOfTheMatch: 0 }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setIsEditing(false);
      setEditForm({});
      setPhotoFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setEditError("");
      setSuccessMsg("");
    } else {
      setEditForm({
        fullName: profile?.fullName || profile?.name || '',
        phone: profile?.phone || '',
        bio: profile?.bio || '',
      });
      setIsEditing(true);
      setEditError("");
      setSuccessMsg("");
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setEditError("Photo size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        setEditError("Please select a valid image file");
        return;
      }
      setPhotoFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setEditError("");
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPreviewUrl(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setEditError("");
  };

  const validateForm = () => {
    if (!editForm.fullName?.trim()) {
      setEditError("Full name is required");
      return false;
    }
    if (!editForm.phone?.trim()) {
      setEditError("Phone is required");
      return false;
    }
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(editForm.phone)) {
      setEditError("Please enter a valid phone number");
      return false;
    }
    return true;
  };

const extractPhoneDigits = (phone) => {
  return phone.replace(/[^0-9]/g, '').slice(0, 15);
};

const handleSave = async () => {
  if (!validateForm()) return;

  setSaveLoading(true);
  setEditError("");
  setSuccessMsg("");

  try {
    // Upload photo if changed
    if (photoFile) {
      const formData = new FormData();
      formData.append('avatar', photoFile);
      await uploadProfileAvatar(formData);
    }

    // Update profile data - CLEAN PHONE for backend validation
    const updateData = {
      fullName: editForm.fullName.trim(),
      phone: extractPhoneDigits(editForm.phone.trim()),
      bio: editForm.bio?.trim() || '',
    };
    
    // DEBUG LOG - Remove after testing
    console.log('Sending profile update:', JSON.stringify(updateData, null, 2));
    console.log('Phone length:', updateData.phone.length, 'Phone value:', updateData.phone);

    if (updateData.phone.length < 10) {
      setEditError('Phone must have at least 10 digits');
      return;
    }

    await updateMyProfile(updateData);

    // Refetch profile
    await fetchProfile();

    setSuccessMsg("Profile updated successfully!");
    setTimeout(() => {
      setIsEditing(false);
      setSuccessMsg("");
    }, 2000);

  } catch (error) {
    console.error('Profile update error:', error.response?.data || error);
    const msg = error.response?.data?.message || error.response?.data?.details?.[0]?.message || error.message || "Update failed";
    setEditError(msg);
  } finally {
    setSaveLoading(false);
  }
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
    setEditError("");
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gray-50">
        <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
          <span className="visually-hidden">Loading profile...</span>
        </div>
      </div>
    );
  }

  const fullProfile = profile || {};

  return (
    <div className="min-vh-100 bg-gray-50 py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10">
            {/* Header */}
            <ProfileHeader user={fullProfile} />

            {/* Tab Navigation */}
            <div className="card shadow-sm mb-4 border-0">
              <div className="card-header bg-white border-0 px-4 pt-0">
                <ul className="nav nav-tabs nav-fill border-0" role="tablist">
                  <li className="nav-item">
                    <button 
                      className={`nav-link border-0 px-4 py-3 fw-semibold ${tab === 'overview' ? 'active bg-primary text-white shadow-sm' : 'text-gray-600 hover-primary'}`} 
                      onClick={() => setTab('overview')}
                    >
                      Overview
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link border-0 px-4 py-3 fw-semibold ${tab === 'stats' ? 'active bg-primary text-white shadow-sm' : 'text-gray-600 hover-primary'}`} 
                      onClick={() => setTab('stats')}
                    >
                      Stats
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link border-0 px-4 py-3 fw-semibold ${tab === 'teams' ? 'active bg-primary text-white shadow-sm' : 'text-gray-600 hover-primary'}`} 
                      onClick={() => setTab('teams')}
                    >
                      Teams
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link border-0 px-4 py-3 fw-semibold ${tab === 'account' ? 'active bg-primary text-white shadow-sm' : 'text-gray-600 hover-primary'}`} 
                      onClick={() => setTab('account')}
                    >
                      Account
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Tab Content */}
            <div className="card shadow-lg border-0">
              <div className="card-body p-0">
                {tab === 'overview' && (
                  <div className="p-5">
                    <div className="row g-4">
                      <div className="col-lg-8">
                        <h4 className="fw-bold text-gray-900 mb-4">Recent Activity</h4>
                        <div className="list-group list-group-flush">
                          <Link to="/my-teams" className="list-group-item list-group-item-action border-0 px-0 py-4 hover-lift">
                            <div className="d-flex align-items-center">
                              <div className="bg-success-subtle rounded-circle p-3 me-3">
                                <FaUsers size={24} className="text-success" />
                              </div>
                              <div>
                                <h6 className="mb-1 fw-semibold">Your Teams</h6>
                                <small className="text-muted">Manage your fantasy teams</small>
                              </div>
                            </div>
                          </Link>
                          <Link to="/contests" className="list-group-item list-group-item-action border-0 px-0 py-4 hover-lift">
                            <div className="d-flex align-items-center">
                              <div className="bg-primary-subtle rounded-circle p-3 me-3">
                                <FaTrophy size={24} className="text-primary" />
                              </div>
                              <div>
                                <h6 className="mb-1 fw-semibold">Active Contests</h6>
                                <small className="text-muted">View joined contests</small>
                              </div>
                            </div>
                          </Link>
                          <Link to="/wallet" className="list-group-item list-group-item-action border-0 px-0 py-4 hover-lift">
                            <div className="d-flex align-items-center">
                              <div className="bg-warning-subtle rounded-circle p-3 me-3">
                                <FaWallet size={24} className="text-warning" />
                              </div>
                              <div>
                                <h6 className="mb-1 fw-semibold">Wallet</h6>
                                <small className="text-muted">Add money, view transactions</small>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="card h-100 shadow-sm border-0">
                          <div className="card-body text-center p-4">
                            <h5 className="fw-bold text-primary mb-3">Upgrade to Pro</h5>
                            <p className="text-gray-600 mb-4">Unlock advanced analytics, private contests, and priority support</p>
                            <Link to="/pro" className="btn btn-primary w-100">Go Pro</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {tab === 'stats' && <StatsSection user={fullProfile} />}

                {tab === 'teams' && (
                  <div className="p-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h4 className="fw-bold text-gray-900 mb-0">My Teams ({fullProfile.teams?.length || 0})</h4>
                      <Link to="/create-team" className="btn btn-primary">
                        <FaPlus className="me-1" /> Create New Team
                      </Link>
                    </div>
                    {(!fullProfile.teams || fullProfile.teams.length === 0) ? (
                      <div className="text-center py-5">
                        <FaUsers size={64} className="text-gray-300 mb-3" />
                        <h5 className="text-gray-500 mb-2">No teams yet</h5>
                        <Link to="/create-team" className="btn btn-outline-primary">Create Your First Team</Link>
                      </div>
                    ) : (
                      <div className="row g-4">
                        {fullProfile.teams.slice(0, 6).map((team) => (
                          <div key={team._id} className="col-md-6 col-lg-4">
                            <div className="card h-100 hover-lift shadow-sm border-0">
                              <div className="card-body p-4">
                                <h6 className="fw-bold mb-2">{team.name}</h6>
                                <small className="text-muted d-block mb-3">
                                  {team.match?.team1} vs {team.match?.team2}
                                </small>
                                <div className="d-flex justify-content-between">
                                  <span className="badge bg-success">
                                    {team.players?.length || 0}/11
                                  </span>
                                  <Link to={`/teams/${team._id}`} className="btn btn-sm btn-outline-primary">
                                    View
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Account Tab - Editable */}
                {tab === 'account' && (
                  <div className="p-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h4 className="fw-bold text-gray-900 mb-0">Account Settings</h4>
                      {!isEditing ? (
                        <button className="btn btn-outline-primary" onClick={handleEditToggle}>
                          <FaEdit className="me-1" /> Edit Profile
                        </button>
                      ) : (
                        <div className="d-flex gap-2">
                          <button className="btn btn-success" onClick={handleSave} disabled={saveLoading}>
                            {saveLoading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-1" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <FaSave className="me-1" />
                                Save Changes
                              </>
                            )}
                          </button>
                          <button className="btn btn-secondary" onClick={handleEditToggle}>
                            <FaTimes className="me-1" /> Cancel
                          </button>
                        </div>
                      )}
                    </div>

                    {successMsg && (
                      <div className="alert alert-success d-flex align-items-center mb-4">
                        <FaCheckCircle className="me-2" />
                        {successMsg}
                      </div>
                    )}

                    {editError && (
                      <div className="alert alert-danger mb-4">{editError}</div>
                    )}

                    {!isEditing ? (
                      <div className="account-section">
                        <h3>Account Info</h3>
                        <div className="account-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem'}}>
                          <div className="account-card" style={{padding: '1.5rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'}}>
                            <FaEnvelope className="mb-2" size={24} style={{color: fullProfile.isEmailVerified ? '#10b981' : '#ef4444'}} />
                            <p style={{margin: '0 0 0.5rem 0', fontWeight: '500'}}>Email</p>
                            <span>{fullProfile.email}</span>
                            <div style={{marginTop: '0.5rem'}}>
                              <span className={`badge ${fullProfile.isEmailVerified ? 'bg-success' : 'bg-danger'}`}>
                                {fullProfile.isEmailVerified ? 'Verified' : 'Not Verified'}
                              </span>
                            </div>
                          </div>
                          <div className="account-card" style={{padding: '1.5rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'}}>
                            <FaPhoneAlt className="mb-2" size={24} style={{color: fullProfile.isPhoneVerified ? '#10b981' : '#ef4444'}} />
                            <p style={{margin: '0 0 0.5rem 0', fontWeight: '500'}}>Phone</p>
                            <span>{fullProfile.phone || 'Not set'}</span>
                            <div style={{marginTop: '0.5rem'}}>
                              <span className={`badge ${fullProfile.isPhoneVerified ? 'bg-success' : 'bg-danger'}`}>
                                {fullProfile.isPhoneVerified ? 'Verified' : 'Not Verified'}
                              </span>
                            </div>
                          </div>
                          <div className="account-card" style={{padding: '1.5rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'}}>
                            <FaUser className="mb-2" size={24} />
                            <p style={{margin: '0 0 0.5rem 0', fontWeight: '500'}}>Member Since</p>
                            <span>{fullProfile.createdAt ? new Date(fullProfile.createdAt).toLocaleDateString() : 'Recent'}</span>
                          </div>
                          <div className="account-card" style={{padding: '1.5rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'}}>
                            <FaCheckCircle className="mb-2" size={24} style={{color: fullProfile.isProfileComplete ? '#10b981' : '#f59e0b'}} />
                            <p style={{margin: '0 0 0.5rem 0', fontWeight: '500'}}>Profile Status</p>
                            <span>{fullProfile.isProfileComplete ? 'Complete' : 'Incomplete'}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="row g-4">
                        {/* Profile Photo */}
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">
                            <FaImage className="me-1" />
                            Profile Photo
                          </label>
                          <div className="photo-upload-container mb-3" style={{border: '2px dashed #d1d5db', borderRadius: '12px', padding: '24px', textAlign: 'center', background: '#f9fafb', transition: 'all 0.2s'}}>
                            <input
                              id="profilePhoto"
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoChange}
                              style={{display: 'none'}}
                            />
                            <label htmlFor="profilePhoto" className="photo-upload-btn" style={{display: 'inline-block', padding: '12px 24px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s'}}>
                              <FaCamera className="me-1" /> {photoFile ? 'Change Photo' : 'Upload Photo'}
                            </label>
                            {previewUrl ? (
                              <div className="photo-preview" style={{position: 'relative', display: 'inline-block', marginTop: '12px'}}>
                                <img src={previewUrl} alt="Preview" style={{width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '4px solid white', boxShadow: '0 4px 20px rgba(0,0,0,0.15)'}} />
                                <button type="button" onClick={removePhoto} className="remove-photo-btn" style={{position: 'absolute', top: '-8px', right: '-8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(239,68,68,0.4)'}}>
                                  <FaTimes size={14} />
                                </button>
                              </div>
                            ) : fullProfile.avatar?.url && !fullProfile.avatar.url.includes('users/avatar') && !fullProfile.avatar.url.includes('68.178.171.95') ? (
                              <div className="current-photo" style={{textAlign: 'center', marginTop: '12px'}}>
                                <img 
                                  src={fullProfile.avatar.url} 
                                  alt="Current" 
                                  style={{width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '4px solid white', boxShadow: '0 4px 20px rgba(0,0,0,0.15)'}}
                                  onError={(e) => {
                                    e.target.src = '/default-avatar.png';
                                  }}
                                />
                                <small className="d-block mt-2">Current photo</small>
                              </div>
                            ) : (
                              <div className="photo-placeholder" style={{color: '#6b7280', marginTop: '12px'}}>
                                <FaImage size={48} className="mb-2" style={{color: '#9ca3af', opacity: 0.7}} />
                                <p>No photo uploaded</p>
                              </div>
                            )}
                          </div>
                          <small className="text-muted">JPG, PNG up to 5MB</small>
                        </div>

                        {/* Form Fields */}
                        <div className="col-md-8">
                          <div className="row g-3">
                            <div className="col-md-6">
                              <label className="form-label fw-semibold">
                                <FaUser className="me-1" />
                                Full Name *
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="fullName"
                                value={editForm.fullName || ''}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-semibold">
                                <FaPhoneAlt className="me-1" />
                                Phone *
                              </label>
                              <input
                                type="tel"
                                className="form-control"
                                name="phone"
                                value={editForm.phone || ''}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="col-12">
                              <label className="form-label fw-semibold">
                                Bio (Optional)
                              </label>
                              <textarea
                                className="form-control"
                                rows="3"
                                name="bio"
                                value={editForm.bio || ''}
                                onChange={handleInputChange}
                                placeholder="Tell us about yourself and your cricket journey..."
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {isEditing && (
                      <div className="mt-4 p-3 bg-light rounded">
                        <small className="text-muted">
                          * Required fields. Changes save securely to backend with photo upload to Cloudinary.
                        </small>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
