import React from "react";
// import Header from "../Components/DashboardSection/Header";
import LiveMatches from "../Components/DashboardSection/LiveMatches";
import UpcomingMatches from "../Components/DashboardSection/UpcomingMatches";
import Leaderboard from "../Components/DashboardSection/Leaderboard";

function Dashboard() {
  return (
    <>

      {/* <Header /> */}
      <LiveMatches />
      <UpcomingMatches />
      <Leaderboard />

    </>
  );
}

export default Dashboard;