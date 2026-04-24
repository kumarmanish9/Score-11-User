import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaMicrophoneSlash, FaVideoSlash, FaStop, FaVolumeMute, FaExpand, FaUserCircle, FaCrown, FaSpinner } from "react-icons/fa";
import { useContext } from "react";
import io from 'socket.io-client';
import { AuthContext } from "../Context/AuthContext";
import { goLive, getLiveStreams, getMyStreams } from "../Services/liveStreamService";
import { getMatches } from "../Services/matchService";
import { getCurrentUser } from "../Services/AuthServices";
import { ROLES } from "../config/roles";
import "../assets/Styles/Global.css";

const GoLive = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [streamData, setStreamData] = useState({
    title: "",
    description: "",
    matchId: "",
    streamType: "camera",
  });
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState(null);
  const [streamCreated, setStreamCreated] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [socket, setSocket] = useState(null);
  const [viewerCount, setViewerCount] = useState(0);
  const agoraRef = useRef(null);
  const [myStreams, setMyStreams] = useState([]);
  const [liveStats, setLiveStats] = useState({ totalLiveStreams: 0, totalViewers: 0 });
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [streamsLoading, setStreamsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const authContext = useContext(AuthContext);
  const { user, setUser } = authContext;

  // Fetch and validate user first ✅ FIXED: Handle flat/nested user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setUserLoading(true);
        setUserError(null);
        const userData = await getCurrentUser();
        console.log("🔍 Raw userData:", userData); // Debug
        
        // ✅ FIXED: Robust normalization for ApiResponse.data.data
        const getFlatUser = (response) => {
          const flat = response?.data?.data || response?.data || response?.user || response || null;
          console.log("🔍 All possible user paths:", {
            'data.data': response?.data?.data,
            'data': response?.data,
            'user': response?.user,
            flat
          });
          return flat;
        };
        const normalizedUser = getFlatUser(userData);
        console.log("🔍 Final normalized user:", normalizedUser);
        
        if (!normalizedUser) {
          throw new Error("No user data returned from API");
        }
        if (!normalizedUser._id && !normalizedUser.id) {
          console.error("❌ User missing ID. Full structure:", normalizedUser);
          throw new Error("User data missing ID - check backend /auth/me");
        }

        
        // ✅ Store normalized flat user
        localStorage.setItem("user", JSON.stringify(normalizedUser));
        if (setUser) {
          setUser(normalizedUser);
        }
        setIsAuthenticated(true);
      } catch (err) {
        console.error("User fetch error:", err);
        const msg = err.response?.status === 404 ? "User not found. Please login again." : 
                    err.response?.status === 401 ? "Session expired. Please login." :
                    err.message || "Failed to load user profile.";
        setUserError(msg);
        // Auto redirect to login after 3s
        setTimeout(() => navigate('/login'), 3000);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUser();
  }, [navigate]); // ✅ Removed setUser dep to prevent loops

  // ✅ FIXED: Use normalized flat user
  const userId = user?._id || null;

  // Socket connection after userId ready
  useEffect(() => {
    if (!userId || !isAuthenticated) return;
    
    const socketInstance = io('http://localhost:5000', {
      transports: ['websocket', 'polling']
    });

    
    socketInstance.on('connect', () => {
      console.log('Socket connected');
      socketInstance.emit('authenticate', userId);
      socketInstance.emit('join-live-dashboard', 'golive');
    });
    
    socketInstance.on('liveStatsUpdate', (stats) => {
      setLiveStats(stats);
    });
    
    socketInstance.on('myStreamUpdate', () => {
      fetchMyStreams();
    });
    
    socketInstance.on('streamStarted', ({ streamId }) => {
      if (streamCreated?._id === streamId) {
        setPublishing(true);
      }
      fetchMyStreams();
    });
    
    socketInstance.on('streamEnded', ({ streamId }) => {
      if (streamCreated?._id === streamId) {
        setPublishing(false);
      }
      fetchMyStreams();
    });
    
    setSocket(socketInstance);
    
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [userId, isAuthenticated, streamCreated?._id]);

  // Fetch my streams
  const fetchMyStreams = useCallback(async () => {
    if (!userId || !isAuthenticated) return;
    try {
      setStreamsLoading(true);
      const streams = await getMyStreams();
      setMyStreams(streams || []);
    } catch (err) {
      console.error("Error fetching my streams:", err);
      setMyStreams([]);
    } finally {
      setStreamsLoading(false);
    }
  }, [userId, isAuthenticated]);

  // Fetch matches
  useEffect(() => {
    if (!userLoading && !userError && isAuthenticated && userId) {
      const fetchMatches = async () => {
        setMatchesLoading(true);
        try {
          const data = await getMatches("upcoming");
          setMatches(data || []);
        } catch (err) {
          console.error("Error fetching matches:", err);
          setMatches([]);
        } finally {
          setMatchesLoading(false);
        }
      };
      fetchMatches();
      fetchMyStreams();
    }
  }, [userId, userLoading, userError, isAuthenticated, fetchMyStreams]);

  const toggleMic = () => {
    setMicEnabled(!micEnabled);
    // TODO: Agora client mute/unmute
  };

  const toggleCamera = () => {
    setCameraEnabled(!cameraEnabled);
    // TODO: Agora client enable/disable
  };

  const stopStream = async () => {
    if (streamCreated) {
      try {
        const response = await fetch(`/api/live-streams/${streamCreated._id}/end`, { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          setPublishing(false);
          setStreamCreated(null);
          if (socket) socket.disconnect();
          fetchMyStreams();
        }
      } catch (err) {
        console.error('Stop stream error:', err);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStreamData(prev => ({ ...prev, [name]: value }));
  };

  const handleMatchSelect = (match) => {
    if (!match?._id) return;
    setSelectedMatch(match);
    setStreamData(prev => ({ ...prev, matchId: match._id }));
  };

  const handleGoLive = async () => {
    if (!userId || !isAuthenticated) {
      alert("Please login to go live");
      navigate('/login');
      return;
    }
    
    if (!streamData.title.trim()) {
      alert("Please enter a stream title");
      return;
    }
    
    if (!streamData.matchId.trim()) {
      alert("Please select a match");
      return;
    }

    setLoading(true);
    try {
      const response = await goLive(streamData);
      setStreamCreated(response);
      await fetchMyStreams();
      alert("✅ Live stream created! Copy the link to share.");
    } catch (err) {
      console.error("Error creating stream:", err);
      alert(err.response?.data?.message || "Failed to go live. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const startStream = async (streamId) => {
    try {
      const streamUrl = `${window.location.origin}/live/${streamId}?role=publisher`;
      window.open(streamUrl, '_blank');
      alert("Publisher window opened! Please allow camera and microphone access.");
    } catch (err) {
      console.error("Start stream error:", err);
      alert("Failed to start stream. Please try again.");
    }
  };

  const copyLink = (streamId) => {
    const link = `${window.location.origin}/live/${streamId}`;
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
  };

  // Loading state
  if (userLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gray-50">
        <div className="text-center">
          <FaSpinner className="spin mb-3" size={48} />
          <h4>Loading profile...</h4>
        </div>
      </div>
    );
  }

  // Error state
  if (userError || !isAuthenticated) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gray-50">
        <div className="alert alert-danger text-center col-md-6">
          <h5>⚠️ {userError || "User not authenticated"}</h5>
          <button className="btn btn-primary mt-3" onClick={() => navigate('/login')}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // ✅ All user data now uses normalized flat user from context

  return (
    <div className="min-vh-100 bg-gray-50 py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow-lg border-0">
              <div className="card-header bg-white border-0 pb-0">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h2 className="h4 mb-0 fw-bold text-gray-900">Go Live Studio</h2>
                  <button className="btn btn-outline-secondary" onClick={() => navigate("/live")}>
                    ← View Live Streams
                  </button>
                </div>

                {/* User Profile Header */}
                <div className="d-flex align-items-center p-3 bg-light rounded-3 mb-3">
                    <img 
                    src={user?.avatar || "/api/placeholder/64/64"} 
                    alt={user?.name || "User"}
                    className="rounded-circle me-3"
                    width="50" 
                    height="50"
                    onError={(e) => {e.target.src = '/api/placeholder/64/64'}}
                  />
                  <div className="flex-grow-1">
                    <div className="fw-bold">{user?.name || "User"}</div>
                    <small className="text-muted">@{user?.email || "No email"}</small>
                  </div>
                  {(user?.role === ROLES.ADMIN || user?.role === ROLES.UMPIRE) && (
                    <div className="badge bg-warning text-dark fs-6">
                      <FaCrown className="me-1" /> PRO
                    </div>
                  )}
                </div>
              </div>
              
              <div className="card-body p-4">
                {!streamCreated ? (
                  <>
                    <div className="row mb-3">
                      <div className="col">
                        <small className="text-success">
                          🌐 Live: {liveStats.totalLiveStreams || 0} streams • {liveStats.totalViewers || 0} viewers
                        </small>
                      </div>
                    </div>
                    
                    {/* Match Selection */}
                    <div className="mb-4">
                      <label className="form-label fw-bold">Select Match *</label>
                      {matchesLoading ? (
                        <div className="text-center p-3">
                          <FaSpinner className="spin" /> Loading matches...
                        </div>
                      ) : (
                        <select 
                          className="form-select" 
                          value={streamData.matchId}
                          onChange={(e) => {
                            const match = matches.find(m => m._id === e.target.value);
                            handleMatchSelect(match);
                          }}
                        >
                          <option value="">Choose upcoming match...</option>
                          {matches.map(match => (
                            <option key={match._id} value={match._id}>
                              {match.team1?.name || "Team1"} vs {match.team2?.name || "Team2"} - {new Date(match.date).toLocaleDateString()}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    {/* Stream Details */}
                    <div className="row mb-4">
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Stream Title *</label>
                        <input 
                          type="text" 
                          name="title"
                          className="form-control" 
                          placeholder="e.g., IND vs AUS Live Commentary"
                          value={streamData.title}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Stream Type</label>
                        <select 
                          name="streamType" 
                          className="form-select" 
                          value={streamData.streamType}
                          onChange={handleInputChange}
                        >
                          <option value="camera">Camera/PC</option>
                          <option value="phone">Mobile</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-bold">Description</label>
                      <textarea 
                        name="description"
                        className="form-control" 
                        rows="3"
                        placeholder="Match preview, commentary style..."
                        value={streamData.description}
                        onChange={handleInputChange}
                      />
                    </div>

                    <button 
                      className="btn btn-success btn-lg w-100" 
                      onClick={handleGoLive}
                      disabled={loading || matchesLoading}
                    >
                      {loading ? <><FaSpinner className="spin me-2" /> Creating...</> : "🚀 Go Live Now"}
                    </button>
                  </>
                ) : (
                  <div className="text-center p-5">
                    <div className="mb-4">
                      <i className="fas fa-broadcast-tower text-success fa-3x"></i>
                      <h3 className="mt-3 text-success">Live Stream Created!</h3>
                      <p className="text-muted">Share this stream with your audience</p>
                    </div>
                    <div className="alert alert-info">
                      <strong>Stream Link:</strong><br/>
                      {`${window.location.origin}/live/${streamCreated._id}`}
                    </div>
                    <div className="btn-group w-100 mb-3">
                      <button className="btn btn-primary" onClick={() => copyLink(streamCreated._id)}>
                        📋 Copy Link
                      </button>
                      <button className="btn btn-success" onClick={() => startStream(streamCreated._id)}>
                        🎥 Start Stream
                      </button>
                    </div>
                    <button className="btn btn-outline-primary w-100" onClick={() => navigate("/live")}>
                      View Live Streams
                    </button>
                  </div>
                )}

                {/* Active Streams List */}
                {myStreams.length > 0 && (
                  <div className="mt-5">
                    <h5 className="mb-3">Your Streams</h5>
                    {streamsLoading ? (
                      <div className="text-center p-3">
                        <FaSpinner className="spin" /> Loading streams...
                      </div>
                    ) : (
                      (Array.isArray(myStreams) ? myStreams : []).map(stream => (
                        <div key={stream._id} className="card mb-2">


                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <h6 className="mb-1">{stream.title}</h6>
                                <small className="text-muted">
                                  Status: {stream.isActive ? "🟢 Live" : "⚫ Offline"} • 
                                  Views: {stream.viewerCount || 0}
                                </small>
                              </div>
                              <div className="btn-group">
                                {stream.isActive && (
                                  <button 
                                    className="btn btn-sm btn-danger" 
                                    onClick={() => stopStream()}
                                  >
                                    <FaStop /> Stop
                                  </button>
                                )}
                                <button 
                                  className="btn btn-sm btn-success" 
                                  onClick={() => startStream(stream._id)}
                                >
                                  Start
                                </button>
                                <button 
                                  className="btn btn-sm btn-info" 
                                  onClick={() => copyLink(stream._id)}
                                >
                                  Copy Link
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
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
};

export default GoLive;