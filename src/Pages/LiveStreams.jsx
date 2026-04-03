import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { getLiveStreams } from '../Services/liveStreamService';
import { FaVideo, FaPlay, FaPlus } from 'react-icons/fa';

const LiveStreams = () => {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchStreams();
  }, []);

  const fetchStreams = async () => {
    try {
      setLoading(true);
      const data = await getLiveStreams();
      setStreams(data);
    } catch (err) {
      setError('No live streams available');
    } finally {
      setLoading(false);
    }
  };

  const handleGoLive = () => {
    if (!user) {
      alert('Login to go live');
      return;
    }
    // TODO: Go live flow
    alert('Go live feature coming soon!');
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border" /></div>;

  return (
    <div className="container py-5">
      <div className="row mb-5">
        <div className="col text-center">
          <h1 className="display-4 fw-bold mb-3 text-danger">
            <FaVideo className="me-3" />
            Live Streams
          </h1>
          <p className="lead">Watch live cricket matches</p>
        </div>
      </div>

      {user && (
        <div className="row mb-4">
          <div className="col-md-4 mx-auto">
            <button className="btn btn-danger w-100 rounded-pill py-3 fs-4 fw-bold shadow-lg" onClick={handleGoLive}>
              <FaPlus className="me-2" />
              Go Live
            </button>
          </div>
        </div>
      )}

      {error && <div className="alert alert-info">{error}</div>}

      <div className="row g-4">
        {streams.map((stream) => (
          <div key={stream._id} className="col-lg-4 col-md-6">
            <div className="card video-card shadow-lg border-0 rounded-3 h-100 overflow-hidden">
              <div className="position-relative overflow-hidden" style={{height: '250px'}}>
                <iframe 
                  src={stream.url || 'https://player.vimeo.com/video/76979871?h=96d7a'} 
                  className="w-100 h-100" 
                  allowFullScreen 
                  title="Live Stream"
                />
                <div className="position-absolute top-0 end-0 p-3">
                  <span className="badge bg-danger fs-6">LIVE</span>
                </div>
              </div>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between mb-2">
                  <h6 className="fw-bold">{stream.title}</h6>
                  <small className="text-muted">12.3k viewers</small>
                </div>
                <p className="text-muted mb-3">{stream.description}</p>
                <div className="d-flex gap-2">
                  <button className="btn btn-primary rounded-pill px-4 py-2 flex-grow-1">
                    <FaPlay className="me-1" />
                    Play
                  </button>
                  <button className="btn btn-outline-secondary rounded-circle p-2">
                    <FaPlus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveStreams;

