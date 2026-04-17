const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../db');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const db = getDb();
        const user = await db.collection('users').findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' } // Fallback to 24h if env var is missing
        );
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Login Error:", error); // Log the full error to the server console
        res.status(500).json({ 
            message: "Error logging in", 
            error: error.message || "Internal Server Error" // Return the message string for JSON visibility
        });
    }
};

const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const db = getDb();
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.collection('users').insertOne({ email, password: hashedPassword, name });

        res.status(201).json({ message: "User registered successfully", data: result });
    } catch (error) {
        console.error("Registration Error:", error); // Log the full error to the server console
        res.status(500).json({ 
            message: "Error registering user", 
            error: error.message || "Internal Server Error" 
        });
    }
};

module.exports = { login, register };