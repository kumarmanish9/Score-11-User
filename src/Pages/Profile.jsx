import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { getCurrentUser } from "../Services/AuthServices";
import { getMyProfile } from "../Services/playerProfileService";
import { FaUsers, FaTrophy, FaWallet, FaPlus, FaCrown } from "react-icons/fa";
import ProfileHeader from "../Components/ProfileSection/ProfileHeader";
import StatsSection from "../Components/ProfileSection/StatsSection";
import PerformanceSection from "../Components/ProfileSection/PerformanceSection";
import AccountSection from "../Components/ProfileSection/AccountSection";
import "../assets/Styles/Global.css";

function Profile() {
  const { user: authUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");

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
      const [profileRes] = await Promise.all([
        getMyProfile().catch(() => ({ data: { data: null } })),
      ]);
      
      setProfile(profileRes.data?.data || {
        ...authUser,
        cricketProfile: { matchesPlayed: 0, totalRuns: 0, totalWickets: 0, highestScore: 0 },
        teams: [],
        stats: { matchesWon: 0, matchesLost: 0, tournamentsWon: 0, manOfTheMatch: 0 }
      });
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

                {tab === 'account' && <AccountSection user={fullProfile} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
