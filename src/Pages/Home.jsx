import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import HeroSection from "../Components/HomeSection/HeroSection1";
import LiveMatches from "../Components/HomeSection/LiveMatches";
import Features from "../Components/HomeSection/Features";
import Players from "../Components/HomeSection/Players";
import Leaderboard from "../Components/HomeSection/Leaderboard";
import Highlights from "../Components/HomeSection/Highlights";
import { getMatches } from "../Services/matchService";
import { getLiveStreams } from "../Services/liveStreamService";
import { getPlayers } from "../Services/playerService";
import "../assets/Styles/Global.css";

function Home() {
  const [liveMatches, setLiveMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [featuredPlayers, setFeaturedPlayers] = useState([]);
  const [liveStreams, setLiveStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      setError('');

      // Safe fetch with fallbacks
      const liveRes = await getMatches('live').catch(() => []);
      const upcomingRes = await getMatches('upcoming').catch(() => []);
      const playerRes = await getPlayers().catch(() => []);
      const streamRes = await getLiveStreams().catch(() => []);

      // Safe slice - ensure array
      setLiveMatches(Array.isArray(liveRes) ? liveRes.slice(0, 6) : []);
      setUpcomingMatches(Array.isArray(upcomingRes) ? upcomingRes.slice(0, 6) : []);
      setFeaturedPlayers(Array.isArray(playerRes) ? playerRes.slice(0, 8) : []);
      setLiveStreams(Array.isArray(streamRes) ? streamRes.slice(0, 4) : []);
    } catch (err) {
      console.error('Home data error:', err);
      setError('Unable to load data. Using fallback content.');
      // Fallback static data
      setLiveMatches([]);
      setUpcomingMatches([]);
      setFeaturedPlayers([]);
      setLiveStreams([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-gray-50 p-5 glass-container">
        <div className="spinner-border text-primary pulse-glow" style={{width: '4rem', height: '4rem'}} role="status">
          <span className="visually-hidden">Loading Score11 Home...</span>
        </div>
        <h1 className="ms-4 display-hero text-primary fade-in-up">Welcome to Score11</h1>
      </div>
    );
  }

  return (
    <div>
      <HeroSection 
        featuredMatches={liveMatches.slice(0, 1)} 
        user={user}
      />
      <LiveMatches 
        live={liveMatches} 
        upcoming={upcomingMatches} 
        refresh={fetchHomeData}
      />
      <Features />
      <Players players={featuredPlayers} />
      <Leaderboard streams={liveStreams} />
      <Highlights matches={liveMatches} />
      
      {error && (
        <div className="alert alert-warning text-center mx-4 mt-4">
          {error} <button className="btn btn-sm btn-outline-light ms-2" onClick={fetchHomeData}>Retry</button>
        </div>
      )}
    </div>
  );
}

export default Home;
