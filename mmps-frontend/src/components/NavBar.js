import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/NavBar.css';

const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    // Update authentication state when location changes (login/logout)
    useEffect(() => {
        setIsAuthenticated(!!localStorage.getItem('token'));
    }, [location]);

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <Link to={isAuthenticated ? "/home" : "/"} className="logo-link">
                        <span className="logo-text">MMPS</span>
                    </Link>
                    {!isAuthenticated && (
                        <Link to="/" className="nav-home-link">Home</Link>
                    )}
                </div>
                
                <ul className="nav-links">
                    <li><NavLink to="/contact-us">Contact</NavLink></li>
                    {!isAuthenticated ? (
                        <li className="nav-login">
                            <Link to="/login" className="login-btn">Login</Link>
                        </li>
                    ) : (
                        <>
                            <li><NavLink to="/home">Dashboard</NavLink></li>
                            <li><NavLink to="/report">Log Mistake</NavLink></li>
                            <li><NavLink to="/analyze">Analyze AI</NavLink></li>
                            <li><NavLink to="/history">History</NavLink></li>
                            <li className="nav-logout">
                                <button onClick={handleLogout} className="logout-btn">Logout</button>
                            </li>
                        </>
                    )}
                </ul>
            </div>
            {/* Navigation Controls (Back/Next) - Optional context-aware logic could be here */}
            {isAuthenticated && (
                <div className="nav-controls">
                    <button onClick={() => navigate(-1)} className="nav-control-btn">← Back</button>
                </div>
            )}
        </nav>
    );
};

const NavLink = ({ to, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    return (
        <Link to={to} className={isActive ? "active" : ""}>
            {children}
        </Link>
    );
};

export default NavBar;