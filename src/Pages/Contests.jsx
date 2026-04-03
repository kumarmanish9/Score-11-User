import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getContests } from '../Services/contestService';
import "../assets/Styles/Global.css";

function Contests() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      setLoading(true);
      const data = await getContests();
      setContests(data.slice(0, 12)); // Show first 12
    } catch (err) {
      setError('Failed to load contests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gray-50">
        <div className="spinner-border text-blue-500" style={{width: '3rem', height: '3rem'}} role="status">
          <span className="visually-hidden">Loading contests...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5 bg-gray-50 min-vh-100">
      <div className="container">
        <div className="row mb-5">
          <div className="col-lg-8">
            <h1 className="display-4 fw-bold mb-3">Live Contests</h1>
            <p className="lead text-gray-700 mb-0">
              Join exciting contests and win big prizes. Thousands of players competing right now!
            </p>
          </div>
        </div>

        {error && (
          <div className="alert alert-warning text-center mb-4">
            {error} <button className="btn btn-outline-primary btn-sm ms-2" onClick={fetchContests}>Retry</button>
          </div>
        )}

        <div className="row g-4">
          {contests.map((contest) => (
            <div key={contest.id} className="col-lg-4 col-md-6">
              <div className="card h-100 hover-lift">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title fw-bold">{contest.name}</h5>
                    <span className="badge bg-primary fs-6 px-3 py-2">
                      Entry: ₹{contest.entryFee || 0}
                    </span>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between text-sm">
                      <span className="text-muted">Spots</span>
                      <span className="fw-semibold">
                        {contest.totalSpots - (contest.joinedSpots || 0)}/{contest.totalSpots}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between text-sm">
                      <span className="text-muted">Prize Pool</span>
                      <span className="fw-bold text-success">
                        ₹{contest.prizePool?.toLocaleString() || '0'}
                      </span>
                    </div>
                    <div className="progress mt-2" style={{height: '6px'}}>
                      <div 
                        className="progress-bar bg-success" 
                        style={{width: `${((contest.joinedSpots || 0) / contest.totalSpots) * 100}%`}}
                      />
                    </div>
                  </div>
                  <Link 
                    to={`/contests/${contest.id}`} 
                    className="btn btn-primary w-100 fw-semibold"
                  >
                    Join Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {contests.length === 0 && !loading && !error && (
          <div className="text-center py-5">
            <h3>No contests available</h3>
            <p className="text-muted">Check back soon for exciting contests!</p>
          </div>
        )}

        <div className="text-center mt-5">
          <Link to="/contests" className="btn btn-outline-primary btn-lg px-5">
            View All Contests
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Contests;
