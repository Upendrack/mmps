import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
    AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts';
import '../styles/MistakeAnalytics.css';

const MistakeAnalytics = ({ mistakes }) => {
    const [insights, setInsights] = useState({
        topTrend: "Click 'Refresh Insights' to analyze patterns.",
        actionItems: ["No recent analysis", "Ready to process", "Standby"],
        status: "Stable"
    });
    const [isFetching, setIsFetching] = useState(false);

    const fetchInsights = async () => {
        if (isFetching || mistakes.length === 0) return;
        

        setIsFetching(true);
        try {
            const response = await api.post('/api/mistakes/summary-analysis');
            setInsights(response.data);
        } catch (error) {
            console.error("Error fetching AI insights:", error);
            // Fallback dynamic insights if AI fails
            const topCategory = categoryData.sort((a, b) => b.value - a.value)[0]?.name || "General";
            setInsights({
                topTrend: `Focus on ${topCategory} patterns to reduce recurring issues.`,
                actionItems: getDynamicRecommendations(),
                status: mistakes.some(m => m.severity === 'Critical' || m.severity === 'High') ? 'High Risk' : 'Stable'
            });
        } finally {
            setIsFetching(false);
        }
    };

    const getDynamicRecommendations = () => {
        const sortedCategories = [...categoryData].sort((a, b) => b.value - a.value);
        const mainCat = sortedCategories[0]?.name || "General";
        
        const recommendations = {
            Technical: [
                "Implement stricter code review for logic blocks",
                "Add unit tests for recent technical failures",
                "Schedule a technical deep-dive on core modules"
            ],
            Personal: [
                "Optimize individual task management workflow",
                "Schedule focus-time blocks to avoid fatigue",
                "Review personal checklist before final submission"
            ],
            General: [
                "Improve team communication documentation",
                "Standardize the mistake logging process",
                "Conduct a brief weekly retrospective"
            ]
        };

        return recommendations[mainCat] || recommendations.General;
    };

    useEffect(() => {
        if (mistakes.length > 0) {
            if (insights.topTrend.includes("Click 'Refresh Insights'")) {
                fetchInsights();
            }
        } else {
            setInsights({
                topTrend: "No mistakes logged yet.",
                actionItems: ["Start logging mistakes", "Monitor system health", "Stay productive"],
                status: "Stable"
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mistakes.length]);

    // Data for PieChart (Breakdown by Category)
    const categoryData = Object.entries(
        mistakes.reduce((acc, current) => {
            const cat = current.category || 'General';
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
        }, {})
    ).map(([name, value]) => ({ name, value }));

    const COLORS = {
        Technical: '#fbbf24',
        General: '#60a5fa',
        Personal: '#f87171'
    };

    // Data for AreaChart (Severity over last 7 days)
    const getPast7Days = () => {
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            // Filter mistakes for this day and count their severity scores
            const dailyMistakes = mistakes.filter(m => {
                const rawDate = m.timestamp || m.Timestamp || m.date || m.Date;
                const mDate = rawDate ? new Date(rawDate) : null;
                return mDate && mDate.toDateString() === d.toDateString();
            });

            data.push({
                date: dateStr,
                count: dailyMistakes.length,
                titles: dailyMistakes.map(m => m.title).join(', ')
            });
        }
        return data;
    };

    const areaData = getPast7Days();

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip" style={{ backgroundColor: '#1e1e2d', color: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <p className="label">{`${label} : ${payload[0].value} Mistakes`}</p>
                    {payload[0].payload.titles && (
                        <p className="desc" style={{ fontSize: '0.8rem', color: '#94a3b8', maxWidth: '200px' }}>
                            {payload[0].payload.titles}
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="analytics-container dark-glass">
            <div className="charts-row">
                <div className="chart-card dark-glass">
                    <h3>Mistake Breakdown</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#6366f1'} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card dark-glass">
                    <h3>Severity Over Time</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={areaData}>
                            <defs>
                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="count" stroke="#fbbf24" fillOpacity={1} fill="url(#colorCount)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="insights-grid">
                <div className={`insight-card dark-glass ${insights.status === 'High Risk' ? 'high-risk-border' : ''}`}>
                    <div className="insight-card-header">
                        <h4><i className="fas fa-robot"></i> AI Global Insights</h4>
                        <button 
                            className="insight-refresh-btn" 
                            onClick={fetchInsights}
                            disabled={isFetching || mistakes.length === 0}
                        >
                            {isFetching ? '...' : <i className="fas fa-sync-alt"></i>}
                        </button>
                    </div>
                    <p className="trend-text">{insights.topTrend}</p>
                    <div className={`status-badge status-${insights.status.toLowerCase().replace(' ', '-')}`}>
                        Status: {insights.status}
                    </div>
                </div>

                <div className="insight-card dark-glass">
                    <h4>Action Plan</h4>
                    <ul className="action-items">
                        {insights.actionItems.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MistakeAnalytics;
