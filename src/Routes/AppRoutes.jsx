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
import ResetPassword from "../Pages/ResetPassword";
import Matches from "../Pages/Matches";
import TournamentList from "../Pages/TournamentList";
import PlayerSearch from "../Pages/PlayerSearch";
import TeamList from "../Pages/TeamList";
import LiveStreams from "../Pages/LiveStreams";
import LiveStreamViewer from "../Pages/LiveStreamViewer";
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
import TournamentPage from "../Pages/TournamentPage";
import TeamHistory from "../Pages/TeamHistory";
import InstantPlayerCreate from "../Pages/InstantPlayerCreate";
import TeamDetails from "../Pages/TeamDetails";
import TeamEdit from "../Pages/TeamEdit";
import InstantPlayerList from "../Pages/InstantPlayerList";
import Upcoming from "../Pages/Upcoming";
import Support from "../Pages/Support";
import MyPortfolio from "../Pages/MyPortfolio";
import ReferEarn from "../Pages/ReferEarn";
import CreateMatch from "../Pages/CreateMatch";
import TossScreen from "../Pages/TossScreen";
import LiveControl from "../Pages/LiveControl";
import TeamSelection from "../Pages/TeamSelection";
import ProtectedLiveControl from "../Components/ProtectedLiveControl";
import ProtectedRoute from "./ProtectedRoute";
import LineupPage from "../Pages/LineupPage";

import ScheduledMatches from "../Pages/ScheduledMatches";
import { Navigate } from "react-router-dom";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/overview" element={<Dashboard />} />
      <Route path="/upcoming" element={<Upcoming />} />
      <Route path="/create-team" element={<CreateTeam />} />
      <Route path="/join-contest" element={<JoinContest />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/matches" element={<Matches />} />
      <Route path="/matches/:id" element={<MatchDetails />} />
      <Route path="/match/:id" element={<MatchDetails />} />
      <Route path="/create-match" element={<CreateMatch />} />
      <Route path="/match/:id/toss" element={<TossScreen />} />
      <Route path="/match/:id/live-control" element={<ProtectedLiveControl />} />
      <Route path="/match/:id/team-select" element={<TeamSelection />} />
      <Route path="/match/:id/start" element={<ProtectedLiveControl />} />
      <Route path="/live-control/:id" element={<Navigate to={`/match/$1/live-control`} replace />} />
      <Route path="/scheduled-matches" element={<Navigate to="/my-matches" replace />} />
      <Route path="/my-matches" element={<ScheduledMatches />} />
      <Route path="/lineup" element={<ProtectedRoute><LineupPage /></ProtectedRoute>} />
      <Route path="/match/:id/lineup" element={<ProtectedRoute><TeamSelection /></ProtectedRoute>} />



      <Route path="/tournaments" element={<TournamentList />} />

      <Route path="/players" element={<PlayerSearch />} />
      <Route path="/players/:id" element={<PlayerProfile />} />
      <Route path="/teams" element={<TeamList />} />
      <Route path="/teams/:id" element={<TeamDetails />} />
      <Route path="/teams/:id/edit" element={<TeamEdit />} />
      <Route path="/live" element={<LiveStreams />} />
      <Route path="/live/:streamId" element={<LiveStreamViewer />} />
      <Route path="/wallet" element={<Wallet />} />
      <Route path="/community" element={<Community />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/support" element={<Support />} />
      <Route path="/pro" element={<Pro />} />
      <Route path="/go-live" element={<GoLive />} />
      <Route path="/store" element={<Store />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/contests" element={<Contests />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/my-teams" element={<MyTeams />} />
      <Route path="/team-history" element={<TeamHistory />} />
      <Route path="/instant-player-create" element={<InstantPlayerCreate />} />
      <Route path="/instant-player-list" element={<InstantPlayerList />} />
      <Route path="/portfolio" element={<MyPortfolio />} />
      <Route path="/refer-earn" element={<ReferEarn />} />
      <Route path="/tournament/:id" element={<TournamentPage />} />
      
    </Routes>
  );
}

export default AppRoutes;

