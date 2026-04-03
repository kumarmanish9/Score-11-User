import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMatchDetails } from '../Services/matchService';
import "../assets/Styles/Global.css";

function MatchDetails() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('scorecard');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMatch();
  }, [id]);

  const fetchMatch = async () => {
    try {
      setLoading(true);
      // TODO: Integrate matchService.getMatchById(id)
      setTimeout(() => {
        setMatch({
          id,
          title: 'RCB vs MI - Qualifier 1',
          date: 'May 24, 2024 • 7:30 PM IST',
          venue: 'M. Chinnaswamy Stadium, Bengaluru',
          status: 'Live - 12.3 overs',
          team1: {
            name: 'RCB',
            score: '89/4',
            flag: 'https://via.placeholder.com/60/FF6B6B/FFFFFF?text=RCB',
            players: ['Faf du Plessis (28)', 'Virat Kohli (35*)', 'Cameron Green (12)', 'Glenn Maxwell (10)']
          },
          team2: {
            name: 'MI',
            score: '76/3',
            flag: 'https://via.placeholder.com/60/4ECDC4/FFFFFF?text=MI',
            players: ['Rohit Sharma (22)', 'Ishan Kishan (18)', 'Suryakumar Yadav (25*)', 'Tilak Varma (8)']
          },
          scorecard: {
            batting: [
              { batsman: 'Virat Kohli', score: '35*', balls: 24, fours: 4, sixes: 1, sr: 145.83 },
              { batsman: 'Faf du Plessis', score: '28', balls: 18, fours: 3, sixes: 1, sr: 155.56 },
              { batsman: 'Cameron Green', score: '12', balls: 10, fours: 1, sixes: 0, sr: 120.00 },
            ],
            bowling: [
              { bowler: 'Jasprit Bumrah', overs: '3', runs: '22', wickets: '1', econ: '7.33' },
              { bowler: 'Gerald Coetzee', overs: '2.3', runs: '28', wickets: '1', econ: '11.20' },
            ]
          },
          commentary: [
            "12.3 Bumrah to Kohli, SIX! Massive hit over long-on! Kohli on fire!",
            "12.2 FOUR! Slower ball smashed through covers",
            "12.1 1 run to deep square leg"
          ]
        });
        setLoading(false);
      }, 1200);
    } catch (err) {
      setError('Failed to load match details');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gray-50">
        <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
          <span className="visually-hidden">Loading match...</span>
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gray-50">
        <div className="text-center p-5">
          <h2 className="mb-4">Match Not Found</h2>
          <Link to="/matches" className="btn btn-primary">All Matches</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5 bg-gray-50 min-vh-100">
      <div className="container">
        {/* Match Header */}
        <div className="row g-4 mb-5">
          <div className="col-12">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-5 text-center">
                <div className="h1 fw-bold mb-3 text-primary">{match.title}</div>
                <div className="h5 text-muted mb-4">{match.date} • {match.venue}</div>
                <div className={`badge fs-4 px-5 py-3 fw-semibold rounded-pill mb-4 ${
                  match.status.includes('Live') ? 'bg-success text-white' : 'bg-secondary'
                }`}>
                  {match.status}
                </div>
              </div>
            </div>
          </div>

          {/* Live Scores */}
          <div className="col-lg-10 mx-auto">
            <div className="row g-0">
              <div className="col-md-6">
                <div className="card h-100 border-end border-0 rounded-start-lg shadow-sm">
                  <div className="card-body p-5 text-center">
                    <img src={match.team1.flag} alt={match.team1.name} className="mb-3 rounded-circle mx-auto" style={{width: '80px', height: '80px'}} />
                    <h2 className="display-4 fw-bold text-primary mb-2">{match.team1.score}</h2>
                    <div className="h4 fw-semibold text-gray-700">{match.team1.name}</div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100 rounded-end-lg shadow-sm">
                  <div className="card-body p-5 text-center">
                    <img src={match.team2.flag} alt={match.team2.name} className="mb-3 rounded-circle mx-auto" style={{width: '80px', height: '80px'}} />
                    <h2 className="display-4 fw-bold text-success mb-2">{match.team2.score}</h2>
                    <div className="h4 fw-semibold text-gray-700">{match.team2.name}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="row mb-5">
          <div className="col-12">
            <ul className="nav nav-tabs justify-content-center gap-3 mb-4 border-bottom-0 p-0" style={{borderBottom: 'none'}}>
              <li className="nav-item">
                <button 
                  className={`btn px-5 py-3 rounded-3 fw-semibold border-bottom-3 ${
                    activeTab === 'scorecard' 
                      ? 'text-primary border-primary shadow-sm bg-blue-50' 
                      : 'text-gray-600 border-transparent hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('scorecard')}
                >
                  Scorecard
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`btn px-5 py-3 rounded-3 fw-semibold border-bottom-3 ${
                    activeTab === 'ball-by-ball' 
                      ? 'text-primary border-primary shadow-sm bg-blue-50' 
                      : 'text-gray-600 border-transparent hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('ball-by-ball')}
                >
                  Ball-by-Ball
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`btn px-5 py-3 rounded-3 fw-semibold border-bottom-3 ${
                    activeTab === 'teams' 
                      ? 'text-primary border-primary shadow-sm bg-blue-50' 
                      : 'text-gray-600 border-transparent hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('teams')}
                >
                  Playing XI
                </button>
              </li>
            </ul>

            {/* Scorecard Tab */}
            {activeTab === 'scorecard' && (
              <div className="card shadow-lg border-0 rounded-4">
                <div className="card-body p-0">
                  <div className="row g-0">
                    <div className="col-lg-6">
                      <div className="p-5 border-end">
                        <h4 className="fw-bold mb-4 pb-2 border-bottom">{match.team1.name} Innings</h4>
                        <table className="table table-borderless">
                          <thead>
                            <tr>
                              <th>Batsman</th>
                              <th>R</th>
                              <th>B</th>
                              <th>4s</th>
                              <th>6s</th>
                              <th>SR</th>
                            </tr>
                          </thead>
                          <tbody>
                            {match.scorecard.batting.slice(0, 6).map((batsman, index) => (
                              <tr key={index}>
                                <td>{batsman.batsman}</td>
                                <td className="fw-bold">{batsman.score}</td>
                                <td>{batsman.balls}</td>
                                <td>{batsman.fours}</td>
                                <td>{batsman.sixes}</td>
                                <td>{batsman.sr}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="p-5">
                        <h4 className="fw-bold mb-4 pb-2 border-bottom">{match.team2.name} Bowling</h4>
                        <table className="table table-borderless">
                          <thead>
                            <tr>
                              <th>Bowler</th>
                              <th>O</th>
                              <th>R</th>
                              <th>W</th>
                              <th>Econ</th>
                            </tr>
                          </thead>
                          <tbody>
                            {match.scorecard.bowling.slice(0, 5).map((bowler, index) => (
                              <tr key={index}>
                                <td>{bowler.bowler}</td>
                                <td>{bowler.overs}</td>
                                <td>{bowler.runs}</td>
                                <td>{bowler.wickets}</td>
                                <td>{bowler.econ}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Ball-by-Ball Tab */}
            {activeTab === 'ball-by-ball' && (
              <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
                <div className="card-body p-0">
                  {match.commentary.slice(0, 15).map((comment, index) => (
                    <div key={index} className="p-4 border-bottom" style={{background: index % 2 === 0 ? '#F8FAFC' : 'white'}}>
                      <div className="fw-semibold text-primary mb-1">12.3</div>
                      <div>{comment}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Teams Tab */}
            {activeTab === 'teams' && (
              <div className="row g-4">
                <div className="col-lg-6">
                  <h4 className="fw-bold mb-4 pb-2 border-bottom">{match.team1.name} Playing XI</h4>
                  <div className="d-flex flex-wrap gap-3">
                    {match.team1.players.slice(0, 11).map((player, index) => (
                      <Link key={index} to={`/players/${player.toLowerCase().replace(' ', '-')}`} className="player-link p-3 rounded-3 hover-lift text-center flex-fill">
                        <div className="fw-bold small mb-1">{player.split(' (')[0]}</div>
                        <small className="text-muted">{player.includes('(C)') ? 'Captain' : 'Player'}</small>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="col-lg-6">
                  <h4 className="fw-bold mb-4 pb-2 border-bottom">{match.team2.name} Playing XI</h4>
                  <div className="d-flex flex-wrap gap-3">
                    {match.team2.players.slice(0, 11).map((player, index) => (
                      <Link key={index} to={`/players/${player.toLowerCase().replace(' ', '-')}`} className="player-link p-3 rounded-3 hover-lift text-center flex-fill">
                        <div className="fw-bold small mb-1">{player.split(' (')[0]}</div>
                        <small className="text-muted">{player.includes('(C)') ? 'Captain' : 'Player'}</small>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center mb-5">
          <Link to="/contests" className="btn btn-primary btn-lg px-5 me-3">
            Create Fantasy Team
          </Link>
          <Link to="/matches" className="btn btn-outline-primary btn-lg px-5">
            Other Matches
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MatchDetails;
