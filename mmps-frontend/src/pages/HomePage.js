import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Stats from '../components/Stats';
import RecentMistakes from '../components/RecentMistakes';
import MistakeAnalytics from '../components/MistakeAnalytics';
import '../styles/HomePage.css';

const HomePage = () => {
    const [mistakes, setMistakes] = useState([]);

    useEffect(() => {
        const fetchMistakes = async () => {
            try {
                const response = await api.get('/api/mistakes');
                setMistakes(response.data);
            } catch (error) {
                console.error('Error fetching mistakes:', error);
            }
        };
        fetchMistakes();
    }, []);

    return (
        <div>
            <div className="home-content">
                <header className="welcome-header">
                    <h1>Welcome to MMPS</h1>
                    <p>
                        Mistake Management & Prevention System helps companies log, analyze, and prevent mistakes efficiently.
                    </p>
                </header>
                
                <Stats mistakes={mistakes} />
                <MistakeAnalytics mistakes={mistakes} />
                <RecentMistakes mistakes={mistakes.slice(0, 5)} />
            </div>
        </div>
    );
};


export default HomePage;