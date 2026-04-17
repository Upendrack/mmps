import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import ReactMarkdown from 'react-markdown';
import '../styles/AnalyzeMistake.css';

const AnalyzeMistake = () => {
    const [mistakes, setMistakes] = useState([]);
    const [analyzingId, setAnalyzingId] = useState(null);
    const [globalSummary, setGlobalSummary] = useState('');
    const [isGeneratingGlobal, setIsGeneratingGlobal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMap, setErrorMap] = useState({}); // Tracking errors per mistake
    
    // Mission: Loading Guard & Loop Protection
    const inProgressRef = useRef(new Set());

    useEffect(() => {
        fetchMistakes();
    }, []);

    // Mission: Auto-Fetch AI Analytics with Caching
    useEffect(() => {
        if (mistakes.length > 0) {
            mistakes.forEach(mistake => {
                // If mistake has no analysis and isn't already analyzed in this session
                if (!mistake.analysis) {
                    // Check Cache Guard
                    const cachedAnalysis = localStorage.getItem(`analysis_${mistake._id}`);
                    if (cachedAnalysis) {
                        // Load from cache immediately
                        updateMistakeAnalysis(mistake._id, cachedAnalysis);
                    } else {
                        // Auto-fetch if not in cache
                        handleAnalyze(mistake);
                    }
                }
            });
        }
    }, [mistakes.length]); // Only trigger when list loads

    const updateMistakeAnalysis = (id, analysis) => {
        setMistakes(prev => prev.map(m => m._id === id ? { ...m, analysis } : m));
    };

    const fetchMistakes = async () => {
        try {
            const response = await api.get('/api/mistakes');
            setMistakes(response.data);
        } catch (error) {
            console.error("Error fetching mistakes:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnalyze = async (mistake, forceRefresh = false) => {
        if (inProgressRef.current.has(mistake._id)) return;
        
        // Caching Logic: If not force refreshing, check localStorage first
        if (!forceRefresh) {
            const cached = localStorage.getItem(`analysis_${mistake._id}`);
            if (cached) {
                updateMistakeAnalysis(mistake._id, cached);
                return;
            }
        }

        console.log(">>> [DEBUG] AI Request Fired for ID:", mistake._id);
        inProgressRef.current.add(mistake._id);
        setAnalyzingId(mistake._id);
        setErrorMap(prev => ({ ...prev, [mistake._id]: null })); // Reset error

        try {
            const response = await api.post('/api/mistakes/analyze', {
                title: mistake.title,
                description: mistake.description, // Verification: Mapping description
                category: mistake.category,
                severity: mistake.severity
            });
            const analysis = response.data.analysis;
            
            // Cache the result (The Loop-Killer)
            localStorage.setItem(`analysis_${mistake._id}`, analysis);
            
            // Persist the analysis to DB
            await api.put(`/api/mistakes/${mistake._id}`, { analysis });
            
            updateMistakeAnalysis(mistake._id, analysis);
        } catch (error) {
            console.error("Error analyzing mistake:", error);
            const status = error.response?.status;
            const restingMsg = (status === 404 || status === 429) 
                ? "AI is currently resting. Using local insights."
                : "Sync unavailable. Please try later.";
            setErrorMap(prev => ({ ...prev, [mistake._id]: restingMsg }));
        } finally {
            inProgressRef.current.delete(mistake._id);
            setAnalyzingId(null);
        }
    };

    const generateGlobalSummary = async () => {
        if (isGeneratingGlobal) return; // Loading Guard
        
        console.log(">>> [DEBUG] AI Request Fired for ID: GLOBAL_SUMMARY");
        setIsGeneratingGlobal(true);
        try {
            const response = await api.post('/api/mistakes/summary-analysis');
            setGlobalSummary(response.data.topTrend + " ||| " + response.data.actionItems.join(', ') + " ||| " + response.data.status);
        } catch (error) {
            console.error("Error generating global summary:", error);
            const errMsg = error.response?.data?.topTrend || "Failed to generate global insights.";
            alert(errMsg);
        } finally {
            setIsGeneratingGlobal(false);
        }
    };

    if (isLoading) return <div className="analyze-container">Loading Dashboard...</div>;

    const parseAnalysis = (analysis) => {
        if (!analysis) return { 
            rootCause: null, 
            solutions: null,
            badge: null,
            isStructured: false
        };
        
        const parts = analysis.split('|||');
        if (parts.length >= 2) {
            // Check if it's 3 parts (Category ||| RC ||| PS) or 2 parts (RC ||| PS)
            if (parts.length >= 3) {
                return {
                    badge: parts[0].trim().replace(/^\[|\]$/g, ''),
                    rootCause: parts[1].trim(),
                    solutions: parts[2].trim(),
                    isStructured: true
                };
            }
            return {
                badge: null,
                rootCause: parts[0].trim(),
                solutions: parts[1].trim(),
                isStructured: true
            };
        }
        
        return { 
            rootCause: analysis.trim(), 
            solutions: null,
            badge: null,
            isStructured: false 
        };
    };

    const parseGlobal = (summary) => {
        if (!summary) return { overview: null, actionPlan: null, keyInsight: null };
        const parts = summary.split('|||');
        return {
            overview: parts[0]?.trim() || "Analyzing trends...",
            actionPlan: parts[1]?.trim() || "Formulating plan...",
            keyInsight: parts[2]?.trim() || "Synthesizing insight..."
        };
    };

    const globalInfo = parseGlobal(globalSummary);

    return (
        <div className="analyze-container">
            <div className="analyze-content">
                <header className="dashboard-header">
                    <h1>Intelligent Insights Dashboard</h1>
                    <p>Leverage AI to uncover patterns and prevent future errors.</p>
                </header>

                {/* Global Insight Card Refactored */}
                <div className="global-insight-card">
                    <div className="insight-header">
                        <h2>
                            <span role="img" aria-label="brain">🧠</span> 
                            Global System Intelligence
                        </h2>
                        <button 
                            className="pill-btn global-btn" 
                            onClick={generateGlobalSummary}
                            disabled={isGeneratingGlobal || mistakes.length === 0}
                        >
                            {isGeneratingGlobal ? 'Generating Brain-Map...' : 'Generate Insights'}
                        </button>
                    </div>
                    {globalSummary ? (
                        <div className="global-insight-grid">
                            <div className="insight-col-left">
                                <h4 className="insight-sub-header">System Health Overview</h4>
                                <div className="insight-body-text">
                                    <ReactMarkdown>{globalInfo.overview}</ReactMarkdown>
                                </div>
                            </div>
                            <div className="insight-col-right">
                                <h4 className="insight-sub-header">Action Plan</h4>
                                <div className="insight-body-text">
                                    <ReactMarkdown>{globalInfo.actionPlan}</ReactMarkdown>
                                </div>
                            </div>
                            <div className="key-insight-section">
                                <span className="key-insight-label">Key Insight of the Month</span>
                                <p className="key-insight-text">{globalInfo.keyInsight}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="insight-body" style={{ textAlign: 'center', opacity: 0.5 }}>
                            Click to analyze patterns across all your engineering activity.
                        </div>
                    )}
                </div>

                {/* Mistakes List */}
                {mistakes.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '100px 0' }}>
                        <h2>No mistakes logged yet.</h2>
                    </div>
                ) : (
                    <div className="mistake-list-rows">
                        {mistakes.map((mistake) => {
                            const { rootCause, solutions, badge, isStructured } = parseAnalysis(mistake.analysis);
                            const isAnalyzing = analyzingId === mistake._id;
                            const currentError = errorMap[mistake._id];

                            return (
                                <div key={mistake._id} className="mistake-analysis-row">
                                    {/* Column 1: Original Data */}
                                    <div className="analysis-col original-data">
                                        <div className="col-inner">
                                            <div className="card-header">
                                                <div className="badge-wrapper">
                                                    <div className={`severity-badge severity-${mistake.severity}`} title={`Severity: ${mistake.severity}`}></div>
                                                    <span className="category-tag">{mistake.category || 'General'}</span>
                                                </div>
                                                <span className="date-text">
                                                    {mistake.Date ? new Date(mistake.Date).toLocaleDateString() : 'Recent'}
                                                </span>
                                            </div>
                                            <h3>{mistake.title}</h3>
                                            <p className="mistake-desc">{mistake.description}</p>
                                        </div>
                                    </div>

                                    {/* Column 2: Root Cause Analysis */}
                                    <div className="analysis-col root-cause">
                                        <div className="col-inner">
                                            <div className="header-with-badge">
                                                <strong><span role="img" aria-label="magnifying glass">🔍</span> Root Cause Analysis</strong>
                                                <div className="header-actions">
                                                    {badge && <span className="ai-insight-badge">{badge}</span>}
                                                    {mistake.analysis && (
                                                        <button 
                                                            className="icon-refresh-btn" 
                                                            onClick={() => handleAnalyze(mistake, true)}
                                                            title="Force Refresh Analysis"
                                                            disabled={isAnalyzing}
                                                        >
                                                            {isAnalyzing ? "..." : "🔄"}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="scrollable-content scroll-active">
                                                {isAnalyzing ? (
                                                    <div className="loading-spinner-subtle">Syncing with AI...</div>
                                                ) : currentError ? (
                                                    <div className="resting-box">
                                                        <p>{currentError}</p>
                                                    </div>
                                                ) : mistake.analysis ? (
                                                    <div className="analysis-text">
                                                        <ReactMarkdown>{rootCause}</ReactMarkdown>
                                                    </div>
                                                ) : (
                                                    <div className="placeholder-text">Ready for analysis.</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Column 3: Solutions & Prevention */}
                                    <div className="analysis-col prevention-steps">
                                        <div className="col-inner">
                                            <strong><span role="img" aria-label="shield">🛡️</span> Solutions & Prevention</strong>
                                            
                                            <div className="scrollable-content scroll-active">
                                                {isAnalyzing ? (
                                                    <div className="loading-spinner-subtle">Formulating fix...</div>
                                                ) : currentError ? (
                                                    <div className="resting-box-empty"></div>
                                                ) : isStructured ? (
                                                    <div className="analysis-text">
                                                        <ReactMarkdown>{solutions}</ReactMarkdown>
                                                    </div>
                                                ) : mistake.analysis ? (
                                                    <div className="upgrade-box">
                                                        <p>Refined Insight available.</p>
                                                        <button 
                                                            className="pill-btn upgrade-btn"
                                                            onClick={() => handleAnalyze(mistake, true)}
                                                        >
                                                            ✨ Update to v2.5
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="placeholder-text">Waiting for data...</div>
                                                )}

                                                {!mistake.analysis && !isAnalyzing && !currentError && (
                                                    <button 
                                                        className="pill-btn analyze-btn"
                                                        onClick={() => handleAnalyze(mistake)}
                                                    >
                                                        Sync Engineering Insights
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalyzeMistake;