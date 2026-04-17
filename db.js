const { MongoClient } = require('mongodb');
require('dotenv').config();

const url = process.env.MONGO_URI;
const dbName = 'mmps1_db';

const client = new MongoClient(url); // Removed useUnifiedTopology
let db;

const connectToDb = async () => {
    try {
        await client.connect();
        db = client.db(dbName);
        console.log(`Connected to database: ${dbName}`);
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1); // Stop the application if the connection fails
    }
};

const getDb = () => {
    if (!db) {
        throw new Error("Database not initialized!");
    }
    return db;
};

module.exports = { connectToDb, getDb };