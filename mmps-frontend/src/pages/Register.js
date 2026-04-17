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
            <h1>Create an Account</h1>
            <form onSubmit={handleRegister} className={shake ? 'shake' : ''}>
                {error && <div className="error-message">{error}</div>}
                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
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
                    {loading ? <div className="spinner"></div> : 'Register'}
                </button>
                <div className="redirect-link">
                    Already have an account? <Link to="/login"><span>Login here</span></Link>
                </div>
            </form>
        </div>
    );
};

export default Register;
