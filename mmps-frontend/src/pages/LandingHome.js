import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/company.css';

const LandingHome = () => {
  const navigate = useNavigate();

  // Removed auto-redirect to allow users to see the landing page first
  /*
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/home');
    }
  }, [navigate]);
  */

  return (
    <div className="company-page-container">
      <main className="company-main-content">
        <section className="hero-section">
          <h1 className="hero-title">
            Mistake Management &amp; <span>Prevention System</span>
          </h1>
          <div className="hero-tagline" style={{ textTransform: 'none', letterSpacing: '1px' }}>
            Track mistakes, analyze root causes, and prevent them from happening again.
          </div>
          <div className="hero-actions">
            <Link to="/product" className="btn-primary">Explore Platform</Link>
            <Link to="/about" className="btn-secondary">Learn More</Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingHome;
