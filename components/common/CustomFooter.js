import React from 'react';
import '../../styles/CustomFooter.css';

const CustomFooter = () => {
  return (
    <footer className="custom-footer">
      <div className="footer-content">
        <div className="footer-left">
          <div className="logo-container">
            <img src="app-icon.png" alt="Logo" className="footer-logo" />
            <span className="logo-text">LavinStudio</span>
          </div>
          <div className="social-icons">
             <img src="./imgs/youtube.png" alt="Logo" className="social-icon" />
             <img src="./imgs/insta.png" alt="Logo" className="social-icon" />
             <img src="./imgs/telegram.png" alt="Logo" className="social-icon" />
             <img src="./imgs/discord.png" alt="Logo" className="social-icon" />
          </div>
        </div>
        <div className="footer-right">
          <nav className="footer-nav">
            <a href="/privacy-policy">privacy policy</a>
            <a href="/terms-of-use">terms of use</a>
            <a href="/contact-us">contact us</a>
            <a href="/guides">guides</a>
          </nav>
          <div className="copyright">
            <p className="copyright-text">© 2024 LavinStudio. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CustomFooter;