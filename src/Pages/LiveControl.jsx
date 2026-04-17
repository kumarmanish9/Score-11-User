import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getMatchDetails, 
  initMatchSocket,
  joinMatchRoom,
  getLiveScore,
  initializeMatch,
  setStriker,
  setNonStriker,
  setBowler,
  addBall,
  startInnings,
  endInnings 
} from '../Services/matchService';
import { getTeamById, getPublicTeam } from '../Services/teamService';
import { getPublicTeam as getPlayerById } from '../Services/playerService';
import WagonWheel from '../Components/Match/WagonWheel';
import "../assets/Styles/Global.css";

const LiveControl = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [liveData, setLiveData] = useState(null);
  const [team1, setTeam1] = useState(null);
  const [team2, setTeam2] = useState(null);
  const [team1Players, setTeam1Players] = useState([]);
  const [team2Players, setTeam2Players] = useState([]);
  const [loading, setLoading] = useState(true);

  // Control state
  const [striker, setStrikerLocal] = useState(null);
  const [nonStriker, setNonStrikerLocal] = useState(null);
  const [bowler, setBowlerLocal] = useState(null);
  const [currentOver, setCurrentOver] = useState(1);
  const [currentBall, setCurrentBall] = useState(1);
  const [shotData, setShotData] = useState({ direction: 'straight', distance: 50 });

  useEffect(() => {
    fetchMatch();
    const token = localStorage.getItem('token');
    if (token) initMatchSocket(token);
    const socket = getMatchSocket();
    if (socket) joinMatchRoom(id);

    const interval = setInterval(fetchLive, 2000);
    return () => {
      clearInterval(interval);
      if (socket) leaveMatchRoom(id);
    };
  }, [id]);

  const getMatchSocket = () => {
    try {
      return matchService.getSocket();
    } catch {
      return null;
    }
  };

  const fetchMatch = async () => {
    try {
      const matchData = await getMatchDetails(id);
      setMatch(matchData);
      setTeam1(await getPublicTeam(matchData.team1._id));
      setTeam2(await getPublicTeam(matchData.team2._id));
      
      // Load players
      const p1 = await Promise.all(matchData.team1.players.slice(0,11).map(id => getPlayerById(id)));
      const p2 = await Promise.all(matchData.team2.players.slice(0,11).map(id => getPlayerById(id)));
      setTeam1Players(p1);
      setTeam2Players(p2);
    } catch (err) {
      navigate('/matches');
    } finally {
      setLoading(false);
    }
  };

  const fetchLive = async () => {
    try {
      const data = await getLiveScore(id);
      setLiveData(data);
    } catch {}
  };

  const handleQuickShot = async (runs, type = 'run') => {
    const ballData = { 
      runs, 
      type,
      overNumber: currentOver,
      ballNumber: currentBall,
      direction: shotData.direction,
      distance: shotData.distance
    };
    try {
      await addBall(id, ballData);
      setCurrentBall(currentBall + 1);
      if (currentBall >= 6) {
        setCurrentOver(currentOver + 1);
        setCurrentBall(1);
      }
    } catch (err) {
      alert('Error adding ball');
    }
  };

  const handleWicket = () => handleQuickShot(0, 'wicket');
  const handleDot = () => handleQuickShot(0);
  const handleSingle = () => handleQuickShot(1);
  const handleTwo = () => handleQuickShot(2);
  const handleFour = () => handleQuickShot(4);
  const handleSix = () => handleQuickShot(6);
  const handleWide = () => handleQuickShot(1, 'wide');

  if (loading) return <div className="text-center p-5">Loading live control...</div>;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between mb-4">
        <h2>Live Control - {match?.matchId}</h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate(`/match/${id}`)}>
          ← View Match
        </button>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body">
              <WagonWheel shotData={shotData} onShotChange={setShotData} />
            </div>
          </div>

          <div className="card mt-4 shadow">
            <div className="card-header bg-primary text-white">
              <h5>Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row g-2 text-center">
                <div className="col-2"><button className="btn btn-outline-secondary py-3 fw-bold" onClick={handleDot}>.</button></div>
                <div className="col-2"><button className="btn btn-outline-primary py-3 fw-bold" onClick={handleSingle}>1</button></div>
                <div className="col-2"><button className="btn btn-outline-primary py-3 fw-bold" onClick={handleTwo}>2</button></div>
                <div className="col-2"><button className="btn btn-warning py-3 fw-bold" onClick={handleFour}>4</button></div>
                <div className="col-2"><button className="btn btn-danger py-3 fw-bold" onClick={handleSix}>6</button></div>
                <div className="col-2"><button className="btn btn-info py-3 fw-bold" onClick={handleWide}>WD</button></div>
              </div>
              <hr />
              <button className="btn btn-danger w-100 py-3 fw-bold" onClick={handleWicket}>WICKET</button>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body">
              <h5>Current Batsmen</h5>
              <select className="form-select mb-2" onChange={(e) => setStrikerLocal(e.target.value)}>
                <option>Striker</option>
                {[...team1Players, ...team2Players].map(p => (
                  <option key={p._id} value={p._id}>{p.playerName}</option>
                ))}
              </select>
              <select className="form-select mb-3" onChange={(e) => setNonStrikerLocal(e.target.value)}>
                <option>Non-Striker</option>
                {[...team1Players, ...team2Players].map(p => (
                  <option key={p._id} value={p._id}>{p.playerName}</option>
                ))}
              </select>

              <h5>Bowler</h5>
              <select className="form-select mb-3" onChange={(e) => setBowlerLocal(e.target.value)}>
                <option>Bowler</option>
                {[...team1Players, ...team2Players].map(p => (
                  <option key={p._id} value={p._id}>{p.playerName}</option>
                ))}
              </select>

              <div className="d-grid gap-2">
                <button className="btn btn-primary" onClick={() => setStriker(id, striker)}>Set Striker</button>
                <button className="btn btn-primary" onClick={() => setNonStriker(id, nonStriker)}>Set Non-Striker</button>
                <button className="btn btn-primary" onClick={() => setBowler(id, bowler)}>Set Bowler</button>
              </div>
            </div>
          </div>

          <div className="card mt-3 shadow">
            <div className="card-body">
              <h6>Live Score: {liveData?.score?.team1?.runs || 0}/{liveData?.score?.team1?.wickets || 0}</h6>
              <h6>Overs: {liveData?.score?.team1?.overs || '0.0'}</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveControl;

