const Summary = require('../models/Summary');
const OpenAI = require("openai")
require("dotenv").config()

const OPENROUTER_API_KEY =process.env.OPENAI_API_KEY;

exports.summarizeText = async (req, res) => {
  const { text } = req.body;
  try {
    const { text } = req.body;
    const openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: OPENROUTER_API_KEY
    });
    const main = async() => {

      const completion = await openai.chat.completions.create({
        model: 'openai/gpt-4o',
        max_completion_tokens:500,
        messages: [
          {
            role: 'user',
            content: text,
          },
        ],
      });

      const answer = completion.choices[0].message.content;
      const newSummary = new Summary({ 
        text : text,  
        summary : answer
      });
      await newSummary.save();

      res.status(201).json({
        message : "ok",
        summary :newSummary
      })
    }
    await main();
  } catch (error) {
    console.error('Summarization error:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
};




// // const Summary = require('../models/Summary');
// // const axios = require('axios');

// // exports.summarizeText = async (req, res) => {
// //   try {
// //     const { text } = req.body;

// //     const response = await axios.post(
// //       'https://api.openai.com/v1/chat/completions',
// //       {
// //         model: 'gpt-3.5-turbo',
// //         messages: [
// //           { role: 'system', content: 'You are a helpful assistant that summarizes text.' },
// //           { role: 'user', content: `Summarize the following:\n\n${text}` },
// //         ],
// //         temperature: 0.5,
// //         max_tokens: 200,
// //       },
// //       {
// //         headers: {
// //           'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
// //           'Content-Type': 'application/json',
// //         },
// //       }
// //     );

// //     const summary = response.data.choices[0].message.content.trim();

// //     const newSummary = new Summary({ text, summary });
// //     await newSummary.save();

// //     res.json({ summary });
// //   } catch (error) {
// //     console.error('Summarization error:', error.response?.data || error.message);
// //     res.status(500).json({ error: 'Failed to generate summary' });
// //   }
// // };
