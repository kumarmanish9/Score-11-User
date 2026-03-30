import "./Footer.css";
import Logo from "../../../assets/Styles/Logo.png";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Left Section */}
        <div className="footer-left">
          <img src={Logo} alt="Logo" className="footer-logo" />
          <p>
            Score11 is your ultimate platform for live matches, contests, and
            sports updates.
          </p>
        </div>

        {/* Center Section */}
        <div className="footer-center">
          <h3>Quick Links</h3>
          <ul>
            <li>Home</li>
            <li>Matches</li>
            <li>Contests</li>
            <li>About</li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="footer-right">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <FaFacebook />
            <FaTwitter />
            <FaInstagram />
            <FaLinkedin />
          </div>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <p>© 2026 Score11. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;