const Summary = require('../models/Summary');
const axios = require('axios');
require('dotenv').config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_GEMINI_MODEL = process.env.GOOGLE_GEMINI_MODEL || 'gemini-1.5-flash';

function extractiveSummarize(input) {
  const raw = String(input).trim();
  // For very short prompts or instructions (e.g., "explain my pdf"),
  // just return the input instead of asking for more text.
  if (raw.split(/\s+/).length < 10 || !/[.!?]/.test(raw)) {
    return raw;
  }
  const sentences = raw
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/);
  const k = Math.min(3, Math.max(1, Math.ceil(sentences.length * 0.25)));
  return sentences.slice(0, k).join(' ');
}

exports.summarizeText = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: 'Text is required' });
    if (!GOOGLE_API_KEY) {
      return res.status(500).json({ error: 'Missing GOOGLE_API_KEY' });
    }
    console.log('Using GOOGLE_API_KEY prefix:', (GOOGLE_API_KEY || '').slice(0, 8));
    const url = `https://generativelanguage.googleapis.com/v1/models/${GOOGLE_GEMINI_MODEL}:generateContent?key=${GOOGLE_API_KEY}`;
    let summaryText;
    try {
      const payload = { contents: [{ parts: [{ text }] }] };
      const { data } = await axios.post(url, payload, { headers: { 'Content-Type': 'application/json' } });
      const parts = data?.candidates?.[0]?.content?.parts || [];
      summaryText = parts.map(p => p.text || '').join('').trim();
      if (!summaryText) throw new Error('Empty response from Gemini');
    } catch (e) {
      const details = e?.response?.data || e?.message || e;
      console.error('Gemini REST generateContent error:', details);
      return res.status(502).json({ error: 'Gemini summarization failed', details });
    }

    const newSummary = new Summary({
      user: req.user.id,
      text,
      summary: summaryText,
    });
    await newSummary.save();

    res.status(201).json({ summary: newSummary });
  } catch (error) {
    console.error('Summarization error:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
};

