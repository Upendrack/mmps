import React from 'react';
import '../styles/company.css';

const Contact = () => {
  return (
    <div className="company-page-container">
      <main className="company-main-content">
        <section className="contact-us-section">
          <div className="glass-card contact-card">
            <h2 className="section-title">Contact Us</h2>
            <p className="section-subtitle">Turn your setbacks into your greatest comebacks. We're here to help.</p>
            <form className="contact-form" onSubmit={(e) => {
              e.preventDefault();
              const name = e.target.name.value;
              const email = e.target.email.value;
              const subjectText = e.target.subject.value;
              const message = e.target.message.value;
              const subject = encodeURIComponent(`MMPS Inquiry: ${subjectText} (from ${name})`);
              const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
              window.location.href = `mailto:upendrakatti2004@gmail.com?subject=${subject}&body=${body}`;
            }}>
              <div className="form-group">
                <input type="text" name="name" placeholder="Your Full Name" required />
              </div>
              <div className="form-group">
                <input type="email" name="email" placeholder="Email Address" required />
              </div>
              <div className="form-group">
                <input type="text" name="subject" placeholder="Subject" required />
              </div>
              <div className="form-group">
                <textarea name="message" placeholder="How can we help you?" required></textarea>
              </div>
              <button type="submit" className="cta-gold-btn">Send Message</button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Contact;
