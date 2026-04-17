const express = require('express');
const router = express.Router();
const { getDb } = require('../db'); // Importing the database connection utility
const { ObjectId, Timestamp } = require('mongodb'); // Importing ObjectId for working with MongoDB document IDs
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash" 
});

// Route to fetch all mistakes
router.get('/', async (req, res) => {
    try {
        const db = getDb(); // Get the database connection
        const mistakes = await db.collection('mistakes').find({}).toArray(); // Retrieve all documents in the 'mistakes' collection
        res.status(200).json(mistakes); // Send the mistakes in the response
    } catch (error) {
        console.error("Error fetching mistakes:", error);
        res.status(500).json({ message: "Internal server error", error }); // Handle errors gracefully
    }
});

// Route to fetch a single mistake by ID
router.get('/:id', async (req, res) => {
    try {
        const db = getDb();
        const id = req.params.id; // Extract the ID from the route parameter
        const mistake = await db.collection('mistakes').findOne({ _id: new ObjectId(id) }); // Find the document by ID
        if (!mistake) {
            return res.status(404).json({ message: "Mistake not found" });
        }
        res.status(200).json(mistake); // Send the mistake in the response
    } catch (error) {
        console.error("Error fetching mistake by ID:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});

// Route to create a new mistake
router.post('/create', async (req, res) => {
    try {
        const { title, description, severity, category } = req.body; // Added category
        if (!title || !description || !severity) {
            return res.status(400).json({ message: "All fields (title, description, severity) are required!" });
        }
        
        let analysis = null;
        try {
            const prompt = `You are an elite Engineering Lead. Analyze the provided mistake. 
            Mandatory Format: [Quick Category Badge like LOGIC ERROR or PROCESS GAP] ||| [Root Cause Analysis content] ||| [Solutions and Prevention content].
            
            Constraint: For each section (Root Cause & Prevention), provide exactly 3-4 high-impact bullet points. 
            No long introductions. Use professional, punchy language. 
            If the mistake is technical, include one specific code-fix suggestion.
            
            Mistake Info:
            Title: "${title}", Description: "${description}", Severity: "${severity}", Category: "${category || 'General'}"`;
            const aiResponse = await model.generateContent(prompt);
            analysis = aiResponse.response.text();
        } catch (aiError) {
            console.error("Error generating AI analysis:", aiError);
            analysis = "Analysis temporarily unavailable. Please retry later.";
        }

        const db = getDb();
        const result = await db.collection('mistakes').insertOne({
            title,
            description,
            severity,
            category: category || 'General', // Store category
            analysis, 
            Date: new Date() 
        });
        res.status(201).json({ message: "Mistake created successfully!", data: result });
    } catch (error) {
        console.error("Error creating mistake:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});

// Route to update a mistake by ID
router.put('/:id', async (req, res) => {
    try {
        const db = getDb();
        const id = req.params.id;
        const { title, description, severity, category, analysis } = req.body; // Added category/analysis

        const updateFields = {};
        if (title) updateFields.title = title;
        if (description) updateFields.description = description;
        if (severity) updateFields.severity = severity;
        if (category) updateFields.category = category;
        if (analysis) updateFields.analysis = analysis;

        const result = await db.collection('mistakes').updateOne(
            { _id: new ObjectId(id) }, 
            { $set: updateFields } 
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Mistake not found" });
        }
        res.status(200).json({ message: "Mistake updated successfully" });
    } catch (error) {
        console.error("Error updating mistake:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});

// Route to delete a mistake by ID
router.delete('/:id', async (req, res) => {
    try {
        const db = getDb();
        const id = req.params.id;
        const result = await db.collection('mistakes').deleteOne({ _id: new ObjectId(id) }); 
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Mistake not found" });
        }
        res.status(200).json({ message: "Mistake deleted successfully" });
    } catch (error) {
        console.error("Error deleting mistake:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});

// Route to generate AI analysis on demand
router.post('/analyze', async (req, res) => {
    try {
        const { title, description, category, severity } = req.body;
        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required" });
        }
        const prompt = `You are an elite Engineering Lead. Analyze the provided mistake. 
        Mandatory Format: [Quick Category Badge like LOGIC ERROR or PROCESS GAP] ||| [Root Cause Analysis content] ||| [Solutions and Prevention content].
        
        Constraint: For each section (Root Cause & Prevention), provide exactly 3-4 high-impact bullet points. 
        No long introductions. Use professional, punchy language. 
        If the mistake is technical, include one specific code-fix suggestion.
        
        Mistake Info:
        Title: "${title}", Desc: "${description}", Cat: "${category}", Sev: "${severity}"`;
        try {
            const aiResponse = await model.generateContent(prompt);
            res.status(200).json({ analysis: aiResponse.response.text() });
        } catch (aiError) {
            const status = aiError.status || 500;
            const message = status === 429 ? "Daily AI quota reached." : 
                           status === 503 ? "AI service is currently overloaded." : 
                           "AI analysis temporarily unavailable.";
                           
            console.error(`AI Analysis Error [${status}]:`, aiError);
            res.status(status).json({ 
                analysis: message, 
                error: true,
                errorDetails: { status, message: aiError.message }
            });
        }
    } catch (error) {
        console.error("Route Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// NEW: Global Summary Analysis Endpoint (JSON)
router.post('/summary-analysis', async (req, res) => {
    try {
        const db = getDb();
        const mistakes = await db.collection('mistakes').find({}).limit(30).toArray();
        if (mistakes.length === 0) {
            return res.status(200).json({ 
                topTrend: "No mistakes logged yet. System is clear.",
                actionItems: ["Start logging mistakes to get insights", "Monitor system health regularly", "Share with teammates"],
                status: "Stable"
            });
        }

        const formattedMistakes = mistakes.map(m => `- [${m.category}] ${m.title} (${m.severity})`).join('\n');
        const prompt = `Analyze these ${mistakes.length} mistakes and return a JSON object ONLY with the following structure:
        {
          "topTrend": "1-sentence summary of the main pattern",
          "actionItems": ["step 1", "step 2", "step 3"],
          "status": "Improving" | "Stable" | "High Risk"
        }
        
        Rules:
        - topTrend must be professional and punchy.
        - actionItems must be exactly 3 specific, actionable strings.
        - status must be one of the three options based on severity and frequency of recent mistakes.
        
        Mistakes Data:
        ${formattedMistakes}`;
        
        try {
            const aiResponse = await model.generateContent(prompt);
            const text = aiResponse.response.text();
            // Clean AI response to extract JSON if it includes markdown code blocks
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const jsonResponse = JSON.parse(jsonStr);
            res.status(200).json(jsonResponse);
        } catch (aiError) {
            const status = aiError.status || 500;
            console.error(`Global AI Insight Error [${status}]:`, aiError);
            res.status(status).json({ 
                topTrend: status === 429 ? "Quota reached. Please try tomorrow." : "Trend analysis temporarily unavailable.",
                actionItems: ["Review logs manually", "Identify recurring bugs", "Check team communication"],
                status: "Stable",
                error: true
            });
        }
    } catch (error) {
        console.error("Route Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = router;