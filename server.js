require('dotenv').config(); // To load environment variables from the .env file
const express = require('express'); // Import Express for building the server
const cors = require('cors'); // Enable Cross-Origin Resource Sharing
const bodyParser = require('body-parser'); // Parse incoming request bodies
const { connectToDb } = require('./db'); // Import the MongoDB connection utility

const app = express(); // Initialize the Express application
const port = process.env.PORT || 5001; // Use the port defined in the .env file or default to 5000


// Connect to the database
connectToDb(); // Establish connection to MongoDB

// Routes
const authRoutes = require('./routes/authRoutes'); // Import authentication routes
const mistakeRoutes = require('./routes/mistakeRoutes'); // Import mistakes routes
app.use(cors())
app.use(express.json());
app.use('/api/auth', authRoutes); // Authentication endpoints (e.g., register, login)
app.use('/api/mistakes', mistakeRoutes); // Mistakes endpoints (e.g., fetch, create, update)

// Health Check Route
app.get('/', (req, res) => {
    res.send('Server is running'); // A simple route to ensure the server is running
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log errors for debugging
    res.status(500).send({ message: "Something went wrong!" }); // Send a generic error response
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`); // Log the port number
    console.log("MMPS AI initialized with Gemini 3 Flash");
});