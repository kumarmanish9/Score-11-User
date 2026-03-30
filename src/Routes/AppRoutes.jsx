import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Register from "../pages/Register";

<Route path="/register" element={<Register />} />
function AppRoutes() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Future Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
   
  );
}

export default AppRoutes;