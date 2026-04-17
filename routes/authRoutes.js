// Import necessary modules
const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authcontroller');

// Route for user registration
router.post('/register', register);

// Route for user login
router.post('/login', login);

// Export the router
module.exports = router;