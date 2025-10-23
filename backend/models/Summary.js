const mongoose = require('mongoose');

const SummarySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  text: String,
  summary: String,
}, { timestamps: true });

module.exports = mongoose.model('Summary', SummarySchema);
