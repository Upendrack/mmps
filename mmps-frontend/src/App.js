import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MistakeList from './components/MistakeList';
import AddMistake from './components/AddMistake';
import Login from './pages/Login';
import Register from './pages/Register';
import AnalyzeMistake from './components/AnalyzeMistake';
import ChatbaseEmbed from './components/ChatbaseEmbed';
import RecentMistakes from './components/RecentMistakes';
import ProtectedRoute from './components/ProtectedRoute';

import NavBar from './components/NavBar';
import Footer from './components/Footer';
import LandingHome from './pages/LandingHome';
import About from './pages/About';
import Product from './pages/Product';
import Contact from './pages/Contact';

const App = () => {
    return (
        <Router>
             <ChatbaseEmbed />
             <NavBar />
            
            <Routes>
                {/* Landing Pages */}
                <Route path="/" element={<LandingHome />} />
                <Route path="/about" element={<About />} />
                <Route path="/product" element={<Product />} />
                <Route path="/contact-us" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* MMPS Application Routes */}
                <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                <Route path="/report" element={<ProtectedRoute><AddMistake /></ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute><MistakeList /></ProtectedRoute>} />
                <Route path="/analyze" element={<ProtectedRoute><AnalyzeMistake /></ProtectedRoute>} />
                <Route path="/RecentMistakes" element={<ProtectedRoute><RecentMistakes/></ProtectedRoute>} />
        
           </Routes>
           <Footer />
        </Router>
    );
    
};

export default App;