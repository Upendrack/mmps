import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { GoogleLogin } from '@react-oauth/google';
import '../styles/Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [shake, setShake] = useState(false);
    
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/api/auth/login', {
                email,
                password
            });
            
            if (response.status === 200) {
                // If login successful -> set token and user, then redirect to MMPS dashboard
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                navigate('/home');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
            setShake(true);
            setTimeout(() => setShake(false), 500); // Remove shake class after animation
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/api/auth/google', {
                tokenId: credentialResponse.credential
            });
            
            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                navigate('/home');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Google Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError('Google Login failed. Please try again.');
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
                    <h1>Welcome Back</h1>
                    <p>Log in to manage your mistakes efficiently.</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    {error && <div className="error-message">{error}</div>}
                    
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
                        {loading ? <div className="spinner"></div> : 'Sign In'}
                    </button>

                    <div className="divider">
                        <span>OR</span>
                    </div>

                    <div className="google-login-wrapper">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            theme="filled_blue"
                            shape="pill"
                            size="large"
                            width="100%"
                        />
                    </div>

                    <div className="footer-links">
                        Don't have an account? <Link to="/register"><span>Register here</span></Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;