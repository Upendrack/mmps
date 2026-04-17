import React from 'react';
import '../styles/Stats.css';

const Stats = ({ mistakes }) => {
    const totalMistakes = mistakes.length;
    const resolvedMistakes = mistakes.filter(m => m.severity === 'Low').length; // Assuming 'Low' as resolved for placeholder logic
    const aiRecommendations = mistakes.filter(m => m.analysis && !m.analysis.includes('unavailable')).length;

    return (
        <div className="stats">
            <div className="stat-card">
                <h3>Total Mistakes</h3>
                <p>{totalMistakes}</p>
            </div>
            <div className="stat-card">
                <h3>Resolved Mistakes</h3>
                <p>{resolvedMistakes}</p>
            </div>
            <div className="stat-card">
                <h3>AI Recommendations</h3>
                <p>{aiRecommendations}</p>
            </div>
        </div>
    );
};

export default Stats;