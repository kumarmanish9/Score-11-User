import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes/AppRoutes";
import Navbar from "./Components/layout/Navbar/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />   {/* 🔥 Navbar always visible */}
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;