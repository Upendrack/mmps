import React from 'react';
import '../styles/company.css';

const About = () => {
  return (
    <div className="company-page-container">
      <main className="company-main-content">
        <div className="glass-container">
          <div className="page-header">
            <h1 className="page-title">About Us</h1>
            <p className="page-subtitle">Pioneering solutions for a better tomorrow.</p>
          </div>
          
          <div className="glass-content">
            <p>
              We are driven by a singular mission: to foster innovation and leadership in software development. 
              Our focus on delivering robust and intelligent solutions empowers individuals and businesses to 
              minimize risks, analyze history, and ultimately reach new heights of success.
            </p>
            <p>
              With a foundation built on technical excellence, we believe that understanding the past is the key 
              to succeeding in the future. The MMPS (Mistake Management System) was born from the idea that 
              errors are simply stepping stones toward perfection, provided we learn from them effectively.
            </p>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <h3>Our Vision</h3>
              <p>To redefine how professionals approach and learn from continuous feedback loops and iterations.</p>
            </div>
            <div className="feature-card">
              <h3>Our Mission</h3>
              <p>Delivering high-performance, robust tools that transform qualitative experiences into quantitative growth.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
