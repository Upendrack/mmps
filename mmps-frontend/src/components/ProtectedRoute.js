import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        // If not logged in -> redirect to login page (which means cannot access dashboard)
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
