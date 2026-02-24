const mongoose = require('mongoose');

const SummarySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  text: String,
  summary: String,
  style: { type: String, default: 'Short' },
  language: { type: String, default: 'English' },
  shareId: { type: String, unique: true, index: true, sparse: true },
  isFavorite: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Summary', SummarySchema);
