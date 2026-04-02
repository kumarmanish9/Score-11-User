import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProfileHeader from "../Components/ProfileSection/ProfileHeader";
import StatsSection from "../Components/ProfileSection/StatsSection";
import PerformanceSection from "../Components/ProfileSection/PerformanceSection";
import AccountSection from "../Components/ProfileSection/AccountSection";

import { getMyProfile } from "../Services/playerProfileService";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // 🔐 Auth check
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchProfile();
    }
  }, [token, navigate]);

  // 🔥 Fetch API
  const fetchProfile = async () => {
    try {
      const res = await getMyProfile();
      console.log("API Response:", res.data);

      // ✅ Adjust if needed
      setUser(res.data.data);
    } catch (error) {
      console.log("Error fetching profile:", error);
    }
  };

  // ⏳ Loader
  if (!user) return <p>Loading...</p>;

  return (
    <>
      <ProfileHeader user={user} />
      <StatsSection user={user} />
      <PerformanceSection user={user} />
      <AccountSection user={user} />
    </>
  );
}

export default Profile;