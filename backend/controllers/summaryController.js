const Summary = require('../models/Summary');
const axios = require('axios');

exports.summarizeText = async (req, res) => {
  try {
    const { text } = req.body;
    
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
      { inputs: text },
      { headers: { 'Authorization': `Bearer ${process.env.HF_API_KEY}` } }
    );

    const summary = response.data[0].summary_text;
    
    const newSummary = new Summary({ text, summary });
    await newSummary.save();

    res.json({ summary });
  } catch (error) {
    console.error('Summarization error:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
};