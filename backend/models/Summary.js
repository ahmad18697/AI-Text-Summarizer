const mongoose = require('mongoose');

const SummarySchema = new mongoose.Schema({
  text: String,
  summary: String,
}, { timestamps: true });

module.exports = mongoose.model('Summary', SummarySchema);
