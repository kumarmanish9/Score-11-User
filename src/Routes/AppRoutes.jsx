import { Routes, Route } from "react-router-dom";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Profile from "../Pages/Profile";
import Dashboard from "../Pages/Dashboard";
import ForgotPassword from "../Pages/ForgotPassword";
import VerifyOtp from "../Pages/VerifyOtp";
import ResetPassword from "../Pages/ResetPassord";
import Matches from "../Pages/Matches";


function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />   {/* ✅ FIX */}
      <Route path="/dashboard" element={<Dashboard />} /> {/* ✅ FIX */}
      <Route path="/forgot-password" element={<ForgotPassword />} /> {/* ✅ New Route */}
      <Route path="/verify-otp" element={<VerifyOtp />} /> {/* ✅ New Route */}
      <Route path="/reset-password" element={<ResetPassword />} /> {/* ✅ New Route */}
      <Route path="/matches" element={<Matches />} /> {/* ✅ New Route */}
    </Routes>
  );
}

export default AppRoutes;