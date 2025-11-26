import React from "react";
import "./Footer.css";
import logoImg from "../assets/Amazon.png"; // Amazon logo in assets
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Back to Top */}
      <div className="footer-back-to-top">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          Back to top
        </button>
      </div>

      {/* Main Footer Links */}
      <div className="footer-links container">
        <div className="footer-section">
          <h4>Get to Know Us</h4>
          <ul>
            <li>About Us</li>
            <li>Careers</li>
            <li>Press Releases</li>
            <li>Amazon Cares</li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Connect with Us</h4>
          <ul className="social-icons">
            <li><FaFacebookF /></li>
            <li><FaTwitter /></li>
            <li><FaInstagram /></li>
            <li><FaYoutube /></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Make Money with Us</h4>
          <ul>
            <li>Sell on Amazon</li>
            <li>Affiliate Program</li>
            <li>Fulfilment Services</li>
            <li>Advertise Your Products</li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Let Us Help You</h4>
          <ul>
            <li>Customer Service</li>
            <li>Returns & Refunds</li>
            <li>Payment Options</li>
            <li>Help</li>
          </ul>
        </div>
      </div>

      {/* Bottom Logo + Copy */}
      <div className="footer-bottom container">
        <img src={logoImg} alt="Amazon Logo" className="footer-logo" />
        <small>© 2025 Amazon Clone - Machine Test</small>
      </div>
    </footer>
  );
};

export default Footer;
