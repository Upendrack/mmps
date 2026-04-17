import React from 'react';
import '../styles/RecentMistakes.css';

const RecentMistakes = ({ mistakes }) => {
    const formatDate = (mistake) => {
        const rawDate = mistake.timestamp || mistake.Timestamp || mistake.date || mistake.Date || mistake.createdAt;
        if (!rawDate) return 'Recently'; 
        
        const dateObj = new Date(rawDate);
        return dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getSeverityClass = (severity) => {
        switch (severity) {
            case 'Critical': return 'severity-critical';
            case 'High': return 'severity-high';
            case 'Medium': return 'severity-medium';
            case 'Low': return 'severity-low';
            default: return '';
        }
    };

    return (
        <div className="recent-mistakes">
            <h2 className="recent-title">Recent Mistakes</h2>
            <div className="mistake-grid">
                {mistakes.map((mistake) => (
                    <div key={mistake._id} className="mistake-card">
                        <h3>{mistake.title}</h3>
                        <p>{mistake.description}</p>
                        <div className="card-footer">
                            <span className={`severity-badge ${getSeverityClass(mistake.severity)}`}>
                                {mistake.severity}
                            </span>
                            <small className="mistake-date">{formatDate(mistake)}</small>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentMistakes;

