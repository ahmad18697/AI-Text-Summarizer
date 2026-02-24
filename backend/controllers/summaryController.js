const Summary = require('../models/Summary');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_GEMINI_MODEL = process.env.GOOGLE_GEMINI_MODEL || 'gemini-1.5-flash';
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

const extractFileText = async (file) => {
  if (!file) return null;
  const mimeType = file.mimetype;
  try {
    if (mimeType === 'application/pdf') {
      let data;
      // Handle constructor versus direct function based on environment module resolution
      if (typeof pdfParse === 'function') {
        data = await pdfParse(file.buffer);
      } else if (pdfParse.default && typeof pdfParse.default === 'function') {
        data = await pdfParse.default(file.buffer);
      } else if (pdfParse.PDFParse) {
        // In some node environments, it exports a class constructor
        try {
          data = await new pdfParse.PDFParse(file.buffer);
        } catch (e) {
          // Fallback if it wasn't a constructor
          data = await pdfParse.PDFParse(file.buffer);
        }
      } else {
        throw new Error('pdf-parse library export not recognized: ' + typeof pdfParse);
      }

      return data.text;
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      return result.value;
    }
  } catch (error) {
    throw new Error(`Failed to extract text from file: ${error.message}`);
  }
  throw new Error('Unsupported file format. Please upload PDF or DOCX.');
};

exports.summarizeText = async (req, res) => {
  try {
    let { text, style, language } = req.body;

    // Default values if not provided
    style = style || 'Short';
    language = language || 'English';

    // If a file is uploaded, extract its text
    if (req.file) {
      if (text) {
        // It's possible the user sent composed text, we append file text
        text = text + "\n\n" + await extractFileText(req.file);
      } else {
        text = await extractFileText(req.file);
      }
    }

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text or file is required to generate a summary.' });
    }

    if (!GOOGLE_API_KEY) {
      return res.status(500).json({ error: 'Server configuration error. API key missing.' });
    }

    const model = genAI.getGenerativeModel({ model: GOOGLE_GEMINI_MODEL });

    // Construct the advanced prompt
    const prompt = `Please summarize the following text.
Settings:
- Style: ${style}
- Output Language: ${language}

Text to summarize:
${text}`;

    let summaryText = '';
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      summaryText = response.text().trim();

      if (!summaryText) {
        throw new Error('Empty response received from Gemini API.');
      }
    } catch (apiError) {
      console.error('Gemini SDK generateContent error:', apiError);
      return res.status(502).json({
        error: 'Failed to generate summary from AI provider.',
        details: apiError.message
      });
    }

    // Save to database with new fields and a unique share ID
    const newSummary = new Summary({
      user: req.user.id,
      text: text,
      summary: summaryText,
      style: style,
      language: language,
      shareId: uuidv4()
    });

    await newSummary.save();

    return res.status(201).json({ summary: newSummary });

  } catch (error) {
    console.error('Summarization controller error:', error);
    return res.status(500).json({ error: error.message || 'An unexpected error occurred.' });
  }
};

exports.getSharedSummary = async (req, res) => {
  try {
    const { shareId } = req.params;
    if (!shareId) return res.status(400).json({ error: 'Share ID required' });

    // Find summary and exclude the user object to keep it anonymous
    const summary = await Summary.findOne({ shareId }).select('-user');

    if (!summary) return res.status(404).json({ error: 'Shared summary not found' });

    return res.status(200).json(summary);
  } catch (error) {
    console.error('Shared summary controller error:', error);
    return res.status(500).json({ error: 'Failed to fetch shared summary.' });
  }
};
