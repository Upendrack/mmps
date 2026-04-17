import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
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
                // If login successful -> set token and redirect to MMPS dashboard
                localStorage.setItem('token', response.data.token);
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

    return (
        <div className="login-container">
            <h1>Login to MMPS</h1>
            <form onSubmit={handleLogin} className={shake ? 'shake' : ''}>
                {error && <div className="error-message">{error}</div>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <div className="password-container">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
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
                <button type="submit" disabled={loading}>
                    {loading ? <div className="spinner"></div> : 'Login'}
                </button>
                <div className="redirect-link">
                    Don't have an account? <Link to="/register"><span>Register here</span></Link>
                </div>
            </form>
        </div>
    );
};

export default Login;