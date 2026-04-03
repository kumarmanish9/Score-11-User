import "./Footer.css";
import Logo from "../../../assets/Styles/Logo.png";
import { 
  FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, 
  FaYoutube, FaDiscord, FaGooglePlay, FaAppStore 
} from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      {/* Main Content */}
      <div className="footer-main">
        <div className="footer-container">
          
          {/* Brand Section */}
          <div className="footer-section">
            <img src={Logo} alt="Score11" className="footer-logo" />
            <p className="footer-desc">
              Score11 - Your ultimate cricket platform for live matches, 
              contests, player stats, teams and community.
            </p>
            <div className="social-icons">
              <a href="#" aria-label="Facebook"><FaFacebookF /></a>
              <a href="#" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
              <a href="#" aria-label="YouTube"><FaYoutube /></a>
              <a href="#" aria-label="Discord"><FaDiscord /></a>
            </div>
          </div>

          {/* Product Links */}
          <div className="footer-section">
            <h3>Product</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/matches">Matches</Link></li>
              <li><Link to="/teams">Teams</Link></li>
              <li><Link to="/tournaments">Tournaments</Link></li>
              <li><Link to="/live">Live Streams</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer-section">
            <h3>Company</h3>
            <ul>
              <li><Link to="/pro">Pro</Link></li>
              <li><Link to="/jobs">Jobs</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h3>Support</h3>
            <ul>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/community">Community</Link></li>
              <li><Link to="/wallet">Wallet</Link></li>
              <li><Link to="/go-live">Go Live</Link></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Newsletter & Apps */}
      <div className="footer-newsletter">
        <div className="footer-container">
          <div className="newsletter-content">
            <h3>Stay Updated</h3>
            <p>Get latest matches, contests & updates</p>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="newsletter-input"
              />
              <button className="newsletter-btn">Subscribe</button>
            </div>
          </div>
          <div className="app-stores">
            <h4>Download App</h4>
            <div className="app-badges">
              <div className="app-badge">
                <FaGooglePlay />
                <span>Google Play</span>
              </div>
              <div className="app-badge">
                <FaAppStore />
                <span>App Store</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <div className="footer-container">
          <p>&copy; 2026 Score11. All rights reserved. | 
            <Link to="/privacy"> Privacy</Link> | 
            <Link to="/terms"> Terms</Link> | 
            <Link to="/cookies"> Cookies</Link>
          </p>
          <div className="footer-extra">
            <span>India: +91 9876543210 | support@score11.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
