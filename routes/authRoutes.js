// Import necessary modules
const express = require('express');
const router = express.Router();
const { login, register, googleLogin } = require('../controllers/authcontroller');

// Route for user registration
router.post('/register', register);

// Route for user login
router.post('/login', login);

// Route for Google OAuth login
router.post('/google', googleLogin);

// Export the router
module.exports = router;