import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/company.css';

const Product = () => {
  return (
    <div className="company-page-container">
      <main className="company-main-content">
        <div className="glass-container">
          <div className="page-header">
            <h1 className="page-title">Mistake Management System</h1>
            <p className="page-subtitle">Turn your setbacks into your greatest comebacks.</p>
          </div>
          
          <div className="glass-content">
            <p>
              MMPS is an enterprise-grade platform designed to track, analyze, and gain actionable insights from mistakes. 
              By providing an intuitive interface for logging errors and a powerful analytical engine for uncovering root causes, 
              we ensure that you never make the same mistake twice.
            </p>
            
            <div className="feature-grid">
              <div className="feature-card">
                <h3>Log & Track</h3>
                <p>Register incidents seamlessly and maintain a searchable historical log of everything that went wrong.</p>
              </div>
              <div className="feature-card">
                <h3>Analyze Core Issues</h3>
                <p>Leverage built-in tools to deeply analyze the root causes and preventative measures for any mistake.</p>
              </div>
              <div className="feature-card">
                <h3>View History</h3>
                <p>A comprehensive dashboard to review historical data and visualize your improvement trajectory over time.</p>
              </div>
              <div className="feature-card">
                <h3>AI Insights</h3>
                <p>Interact with advanced AI assistants to extract insights directly from your mistake logs.</p>
              </div>
            </div>

            <div style={{ marginTop: '50px', textAlign: 'center' }}>
              <Link to="/login" className="btn-primary">Get Started Now</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Product;
