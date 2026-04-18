import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/Login.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [shake, setShake] = useState(false);
    
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const response = await api.post('/api/auth/register', {
                name,
                email,
                password
            });
            
            if (response.status === 201) {
                // Register successful -> redirect to login page
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register. Please try again.');
            setShake(true);
            setTimeout(() => setShake(false), 500); // Remove shake class after animation
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="back-home">
                <Link to="/" className="back-home-link">
                    ← Back to Home
                </Link>
            </div>

            <div className={`login-card ${shake ? 'shake' : ''}`}>
                <div className="login-header">
                    <h1>Create Account</h1>
                    <p>Join MMPS to start tracking and analyzing mistakes.</p>
                </div>

                <form onSubmit={handleRegister} className="login-form">
                    {error && <div className="error-message">{error}</div>}
                    
                    <div className="input-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span 
                                className="password-toggle" 
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '🐵' : '👁'}
                            </span>
                        </div>
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? <div className="spinner"></div> : 'Register'}
                    </button>

                    <div className="footer-links">
                        Already have an account? <Link to="/login"><span>Login here</span></Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
