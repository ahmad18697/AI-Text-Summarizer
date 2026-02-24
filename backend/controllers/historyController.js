const Summary = require('../models/Summary');

// GET: fetch all summaries
exports.getHistory = async (req, res) => {
  try {
    const summaries = await Summary.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(summaries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

// DELETE: remove summary by ID
exports.deleteHistory = async (req, res) => {
  try {
    const deleted = await Summary.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Summary deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete summary' });
  }
};

// PATCH: Toggle favorite status
exports.toggleFavorite = async (req, res) => {
  try {
    const summaryItem = await Summary.findOne({ _id: req.params.id, user: req.user.id });
    if (!summaryItem) return res.status(404).json({ error: 'Summary not found' });

    summaryItem.isFavorite = !summaryItem.isFavorite;
    await summaryItem.save();

    res.json({ isFavorite: summaryItem.isFavorite, message: 'Favorite status updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update favorite status' });
  }
};
