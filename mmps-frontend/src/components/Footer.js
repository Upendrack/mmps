import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/company.css';

const Footer = () => {
  const location = useLocation();
  const publicPaths = ['/', '/about', '/product', '/contact', '/login'];

  if (!publicPaths.includes(location.pathname)) {
    return null;
  }
  return (
    <footer className="company-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h2>UPENDRA</h2>
          <p className="footer-tagline">
            Developer <span className="sep">|</span> Innovation <span className="sep">|</span> Leadership
          </p>
        </div>
        
        <div className="footer-contact">
          <p><strong>Creator:</strong> Upendra C K</p>
          <p><strong>Phone:</strong> +91 6361737907</p>
          <p><strong>Email:</strong> <a href="mailto:upendrakatti2004@gmail.com">upendrakatti2004@gmail.com</a></p>
          <p><strong>LinkedIn:</strong> <a href="https://linkedin.com/in/upendra-c-k-cse-a16304267" target="_blank" rel="noopener noreferrer">linkedin.com/in/upendra-c-k-cse-a16304267</a></p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2026 UPENDRA. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
