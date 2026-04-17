const express = require('express');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/completions', async (req, res) => {
    try {
        const { prompt } = req.body;
        const aiResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        res.status(200).json({ text: aiResponse.text });
    } catch (error) {
        console.error("Error", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));