import { Routes, Route } from "react-router-dom";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Profile from "../Pages/Profile";
import Dashboard from "../Pages/Dashboard";
import CreateTeam from "../Pages/CreateTeam";
import JoinContest from "../Pages/JoinContest";
import ForgotPassword from "../Pages/ForgotPassword";
import VerifyOtp from "../Pages/VerifyOtp";
import ResetPassword from "../Pages/ResetPassord";
import Matches from "../Pages/Matches";
import TournamentList from "../Pages/TournamentList";
import PlayerSearch from "../Pages/PlayerSearch";
import TeamList from "../Pages/TeamList";
import LiveStreams from "../Pages/LiveStreams";
import Wallet from "../Pages/Wallet";
import Community from "../Pages/Community";
import Blogs from "../Pages/Blogs";
import FAQ from "../Pages/FAQ";
import Pro from "../Pages/Pro";
import GoLive from "../Pages/GoLive";
import Store from "../Pages/Store";
import Jobs from "../Pages/Jobs";
import Contact from "../Pages/Contact";
import Contests from "../Pages/Contests";
import Leaderboard from "../Pages/Leaderboard";
import PlayerProfile from "../Pages/PlayerProfile";
import MatchDetails from "../Pages/MatchDetails";
import MyTeams from "../Pages/MyTeams";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-team" element={<CreateTeam />} />
      <Route path="/join-contest" element={<JoinContest />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/matches" element={<Matches />} />
      <Route path="/matches/:id" element={<MatchDetails />} />
      <Route path="/match/:id" element={<MatchDetails />} />
      <Route path="/tournaments" element={<TournamentList />} />
      <Route path="/players" element={<PlayerSearch />} />
      <Route path="/players/:id" element={<PlayerProfile />} />
      <Route path="/teams" element={<TeamList />} />
      <Route path="/live" element={<LiveStreams />} />
      <Route path="/wallet" element={<Wallet />} />
      <Route path="/community" element={<Community />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/pro" element={<Pro />} />
      <Route path="/go-live" element={<GoLive />} />
      <Route path="/store" element={<Store />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/contests" element={<Contests />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/my-teams" element={<MyTeams />} />
    </Routes>
  );
}

export default AppRoutes;
