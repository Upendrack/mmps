import React, { useState } from 'react';
import api from '../services/api';
import '../styles/AddMistake.css';

const AddMistake = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        severity: '',
        category: '', // Added category state
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/mistakes/create', formData);
            alert('Mistake logged successfully!');
            setFormData({ title: '', description: '', severity: '', category: '' });
        } catch (error) {
            console.error('Error logging mistake:', error);
            alert('Failed to log the mistake. Please try again.');
        }
    };

    return (
        <div className="add-mistake-container">
            <form className="add-mistake-card" onSubmit={handleSubmit}>
                <h2>Log a New Mistake</h2>
                <div className="input-group">
                    <input
                        type="text"
                        name="title"
                        placeholder="Mistake Title (e.g., Database Connection Failure)"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-group">
                    <textarea
                        name="description"
                        placeholder="What exactly happened? What were the consequences?"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>

                <div className="form-row">
                    <div className="input-group">
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Technical">Technical</option>
                            <option value="Communication">Communication</option>
                            <option value="Process">Process</option>
                            <option value="Personal">Personal</option>
                            <option value="Financial">Financial</option>
                            <option value="Miscellaneous">Miscellaneous</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <select
                            name="severity"
                            value={formData.severity}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Severity</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>
                </div>

                <button type="submit" className="submit-btn">Log Mistake & Analyze</button>
            </form>
        </div>
    );
};

export default AddMistake;
