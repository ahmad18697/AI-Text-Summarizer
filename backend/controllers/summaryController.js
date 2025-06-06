// const Summary = require('../models/Summary');
// const axios = require('axios');

// exports.summarizeText = async (req, res) => {
//   try {
//     const { text } = req.body;
    
//     const response = await axios.post(
//       'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
//       { inputs: text },
//       { headers: { 'Authorization': `Bearer ${process.env.HF_API_KEY}` } }
//     );

//     const summary = response.data[0].summary_text;
    
//     const newSummary = new Summary({ text, summary });
//     await newSummary.save();

//     res.json({ summary });
//   } catch (error) {
//     console.error('Summarization error:', error);
//     res.status(500).json({ error: 'Failed to generate summary' });
//   }
// };




const Summary = require('../models/Summary');
const axios = require('axios');

exports.summarizeText = async (req, res) => {
  try {
    const { text } = req.body;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that summarizes text.' },
          { role: 'user', content: `Summarize the following:\n\n${text}` },
        ],
        temperature: 0.5,
        max_tokens: 200,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const summary = response.data.choices[0].message.content.trim();

    const newSummary = new Summary({ text, summary });
    await newSummary.save();

    res.json({ summary });
  } catch (error) {
    console.error('Summarization error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
};
