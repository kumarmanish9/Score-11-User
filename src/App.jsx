import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes/AppRoutes";
import Navbar from "./Components/Layout/Navbar/Navbar";
import Footer from "./Components/Layout/Footer/Footer"; // import footer
import "./assets/Styles/Global.css";
function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />

        <main className="main-content">
          <AppRoutes />
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;