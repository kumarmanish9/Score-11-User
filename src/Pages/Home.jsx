import HeroSection from "../Components/HomeSection/HeroSection1";
import LiveMatches from "../Components/HomeSection/LiveMatches";
import Features from "../Components/HomeSection/Features";
import Players from "../Components/HomeSection/Players";
import Leaderboard from "../Components/HomeSection/Leaderboard";
import Highlights from "../Components/HomeSection/Highlights";
function Home() {
  return (
    <>
      <HeroSection />
      <LiveMatches />
      <Features />
      <Players />
      <Leaderboard />
      <Highlights />
    </>
  );
}

export default Home;