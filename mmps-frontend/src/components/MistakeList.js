import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../styles/MistakeList.css';

const MistakeList = () => {
    const [mistakes, setMistakes] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [editFormData, setEditFormData] = useState({
        title: '',
        description: '',
        severity: 'Low',
        category: 'General'
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchMistakes();
    }, []);

    const fetchMistakes = async () => {
        try {
            const response = await api.get('/api/mistakes');
            const data = Array.isArray(response.data) ? response.data : [];
            const formattedData = data.map(m => {
                // Try all common date field names as fallback
                const rawDate = m.Date || m.date || m.timestamp || m.Timestamp || m.createdAt;
                return {
                    ...m,
                    timestamp: rawDate ? new Date(rawDate) : null
                };
            });
            setMistakes(formattedData);
        } catch (error) {
            console.error('Error fetching mistakes:', error);
        }
    };


    // Filter and Sort Logic
    const filteredMistakes = mistakes
        .filter(mistake => {
            const matchesSearch = mistake.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = categoryFilter === 'All' || mistake.category === categoryFilter;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            if (!a.timestamp || !b.timestamp) return 0;
            return sortOrder === 'newest' 
                ? b.timestamp - a.timestamp 
                : a.timestamp - b.timestamp;
        });

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this mistake?')) return;
        
        try {
            await api.delete(`/api/mistakes/${id}`);
            setMistakes(mistakes.filter((mistake) => mistake._id !== id));
        } catch (error) {
            console.error('Error deleting mistake:', error);
            alert('Failed to delete mistake.');
        }
    };

    const handleEditClick = (e, mistake) => {
        e.stopPropagation();
        setEditingId(mistake._id);
        setEditFormData({
            title: mistake.title,
            description: mistake.description,
            severity: mistake.severity,
            category: mistake.category || 'General'
        });
    };

    const handleEditFormChange = (e) => {
        setEditFormData({
            ...editFormData,
            [e.target.name]: e.target.value
        });
    };

    const handleCancelClick = (e) => {
        e.stopPropagation();
        setEditingId(null);
    };

    const handleSaveClick = async (e, id) => {
        e.stopPropagation();
        try {
            await api.put(`/api/mistakes/${id}`, editFormData);
            setEditingId(null);
            fetchMistakes();
        } catch (error) {
            console.error('Error updating mistake:', error);
            alert('Failed to update mistake.');
        }
    };

    const getSeverityPill = (severity) => {
        const s = severity?.toLowerCase() || 'low';
        return <span className={`severity-pill severity-${s}`}>{severity}</span>;
    };

    const formatTimestamp = (date) => {
        if (!date) return '—';
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const getCategoryBadge = (category) => {
        const cat = category || 'General';
        const catClass = `category-${cat.toLowerCase().replace(/\s+/g, '-')}`;
        return <span className={`category-badge ${catClass}`}>{cat}</span>;
    };

    // Icons
    const EditIcon = () => (
        <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
    );

    const DeleteIcon = () => (
        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
    );

    const SaveIcon = () => (
        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    );

    const CancelIcon = () => (
        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    );

    return (
        <div className="mistake-list">
            <div className="header-with-actions">
                <h2>Mistake History</h2>
                <div className="navigation-group">
                    <button onClick={() => navigate('/report')} className="nav-btn">Add New</button>
                    <button onClick={() => navigate('/analyze')} className="nav-btn">Analyze AI</button>
                </div>
            </div>

            <div className="list-controls">
                <div className="search-group">
                    <input 
                        type="text" 
                        className="search-input" 
                        placeholder="Search by title..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <select 
                        className="filter-select"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="All">All Categories</option>
                        <option value="General">General</option>
                        <option value="Technical">Technical</option>
                        <option value="Personal">Personal</option>
                    </select>
                    <select 
                        className="filter-select"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                </div>
            </div>

            <div className="dark-glass table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Severity</th>
                            <th>Date & Time</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMistakes.map((mistake) => (
                            <tr 
                                key={mistake._id} 
                                className={editingId === mistake._id ? "" : "history-row"}
                            >
                                {editingId === mistake._id ? (
                                    <>
                                        <td>
                                            <input
                                                className="table-input"
                                                type="text"
                                                name="title"
                                                value={editFormData.title}
                                                onChange={handleEditFormChange}
                                                autoFocus
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className="table-input"
                                                type="text"
                                                name="description"
                                                value={editFormData.description}
                                                onChange={handleEditFormChange}
                                            />
                                        </td>
                                        <td>
                                            <select
                                                className="table-select"
                                                name="category"
                                                value={editFormData.category}
                                                onChange={handleEditFormChange}
                                            >
                                                <option value="General">General</option>
                                                <option value="Technical">Technical</option>
                                                <option value="Personal">Personal</option>
                                            </select>
                                        </td>
                                        <td>
                                            <select
                                                className="table-select"
                                                name="severity"
                                                value={editFormData.severity}
                                                onChange={handleEditFormChange}
                                            >
                                                <option value="Low">Low</option>
                                                <option value="Medium">Medium</option>
                                                <option value="High">High</option>
                                                <option value="Critical">Critical</option>
                                            </select>
                                        </td>
                                        <td className="time-cell">
                                            {formatTimestamp(mistake.timestamp)}
                                        </td>
                                        <td className="action-buttons">
                                            <button className="icon-btn save-btn" onClick={(e) => handleSaveClick(e, mistake._id)} title="Save"><SaveIcon /></button>
                                            <button className="icon-btn cancel-btn" onClick={handleCancelClick} title="Cancel"><CancelIcon /></button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="title-cell">{mistake.title}</td>
                                        <td className="desc-cell">{mistake.description}</td>
                                        <td>{getCategoryBadge(mistake.category)}</td>
                                        <td>{getSeverityPill(mistake.severity)}</td>
                                        <td className="time-cell">
                                            {formatTimestamp(mistake.timestamp)}
                                        </td>
                                        <td className="action-buttons">
                                            <button className="icon-btn edit-btn" onClick={(e) => handleEditClick(e, mistake)} title="Edit"><EditIcon /></button>
                                            <button className="icon-btn delete-btn" onClick={(e) => handleDelete(e, mistake._id)} title="Delete"><DeleteIcon /></button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MistakeList;
