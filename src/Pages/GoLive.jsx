import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { goLive, getLiveStreams } from "../Services/liveStreamService";
import { getMatches } from "../Services/matchService";
import "../assets/Styles/Global.css";

const GoLive = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [streamData, setStreamData] = useState({
    title: "",
    description: "",
    matchId: "",
    streamType: "camera", // camera or phone
  });
  const [loading, setLoading] = useState(false);
  const [streamCreated, setStreamCreated] = useState(null);
  const [myStreams, setMyStreams] = useState([]);

  // Fetch matches and my streams on load
  useEffect(() => {
    fetchMatches();
    fetchMyStreams();
  }, []);

  const fetchMatches = async () => {
    try {
      const data = await getMatches("upcoming");
      setMatches(data.slice(0, 10));
    } catch (err) {
      console.error("Error fetching matches:", err);
    }
  };

  const fetchMyStreams = async () => {
    try {
      const streams = await getLiveStreams();
      setMyStreams(streams.filter(s => s.owner === "me")); // Filter user streams
    } catch (err) {
      console.error("Error fetching streams:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStreamData(prev => ({ ...prev, [name]: value }));
  };

  const handleMatchSelect = (match) => {
    setSelectedMatch(match);
    setStreamData(prev => ({ ...prev, matchId: match._id }));
  };

  const handleGoLive = async () => {
    if (!streamData.title || !streamData.matchId) {
      alert("Please select match and add title");
      return;
    }

    setLoading(true);
    try {
      const response = await goLive(streamData);
      setStreamCreated(response);
      fetchMyStreams(); // Refresh list
      alert("Live stream created! Copy the link to share.");
    } catch (err) {
      console.error("Error creating stream:", err);
      alert(err.response?.data?.message || "Failed to go live");
    } finally {
      setLoading(false);
    }
  };

  const startStream = async (streamId) => {
    try {
      await fetch(`/api/v1/live-streams/${streamId}/token`); // Get RTC token
      // In production, open WebRTC/RTMP client
      alert("Stream started! Use your stream key in OBS/RTMP app.");
    } catch (err) {
      alert("Failed to start stream");
    }
  };

  const copyLink = (streamId) => {
    navigator.clipboard.writeText(`${window.location.origin}/live/${streamId}`);
    alert("Link copied!");
  };

  return (
    <div className="min-vh-100 bg-gray-50 py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow-lg border-0">
              <div className="card-header bg-white border-0 pb-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h2 className="h4 mb-0 fw-bold text-gray-900">Go Live</h2>
                  <button className="btn btn-outline-secondary" onClick={() => navigate("/live")}>
                    ← View Live Streams
                  </button>
                </div>
              </div>
              <div className="card-body p-4">
                {!streamCreated ? (
                  <>
                    <div className="mb-4">
                      <label className="form-label fw-bold">Select Match</label>
                      <select 
                        className="form-select" 
                        onChange={(e) => handleMatchSelect(matches.find(m => m._id === e.target.value))}
                      >
                        <option value="">Choose upcoming match...</option>
                        {matches.map(match => (
                          <option key={match._id} value={match._id}>
                            {match.team1?.name || "Team1"} vs {match.team2?.name || "Team2"}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="row mb-4">
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Stream Title</label>
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
                        <select name="streamType" className="form-select" onChange={handleInputChange}>
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
                      disabled={loading}
                    >
                      {loading ? "Creating..." : "🚀 Go Live Now"}
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
                      <strong>Stream Link:</strong> <br/>
                      /live/{streamCreated._id}
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
                      View My Streams
                    </button>
                  </div>
                )}

                {myStreams.length > 0 && (
                  <div className="mt-5">
                    <h5 className="mb-3">Your Active Streams</h5>
                    {myStreams.map(stream => (
                      <div key={stream._id} className="card mb-2">
                        <div className="card-body">
                          <h6>{stream.title}</h6>
                          <div className="btn-group">
                            <button className="btn btn-sm btn-success" onClick={() => startStream(stream._id)}>
                              Start
                            </button>
                            <button className="btn btn-sm btn-info" onClick={() => copyLink(stream._id)}>
                              Copy Link
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
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
