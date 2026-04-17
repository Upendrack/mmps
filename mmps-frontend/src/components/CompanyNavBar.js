import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/company.css';

const CompanyNavBar = () => {
    const location = useLocation();
    
    // Check if the link matches the current path
    const isActive = (path) => {
        return location.pathname === path ? "company-nav-link active" : "company-nav-link";
    };

    // Do not show the navigation bar on the internal MMPS pages 
    // such as /home, /report, /history, /analyze, /RecentMistakes
    const appRoutes = ['/home', '/report', '/history', '/analyze', '/RecentMistakes'];
    if (appRoutes.includes(location.pathname)) {
        return null;
    }

    return (
        <nav className="company-nav">
            <Link to="/" className="company-nav-brand">
                UPENDRA
            </Link>
            
            <div className="company-nav-links">
                <Link to="/" className={isActive('/')}>Home</Link>
                <Link to="/about" className={isActive('/about')}>About</Link>
                <Link to="/product" className={isActive('/product')}>Product</Link>
                <Link to="/contact" className={isActive('/contact')}>Contact</Link>
                <Link to="/login" className="company-nav-link company-nav-btn">Login</Link>
            </div>
        </nav>
    );
};

export default CompanyNavBar;
