const Summary = require('../models/Summary');

exports.getHistory = async (req, res) => {
  try {
    const summaries = await Summary.find().sort({ createdAt: -1 });
    res.json(summaries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};