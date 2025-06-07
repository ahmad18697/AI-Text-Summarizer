const Summary = require('../models/Summary');

// GET: fetch all summaries
exports.getHistory = async (req, res) => {
  try {
    const summaries = await Summary.find().sort({ createdAt: -1 });
    res.json(summaries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

// DELETE: remove summary by ID
exports.deleteHistory = async (req, res) => {
  try {
    await Summary.findByIdAndDelete(req.params.id);
    res.json({ message: 'Summary deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete summary' });
  }
};
