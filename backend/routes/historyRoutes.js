const express = require('express');
const router = express.Router();
const { getHistory, deleteHistory } = require('../controllers/historyController');

// GET all summaries
router.get('/', getHistory);

// DELETE a summary by ID
router.delete('/:id', deleteHistory);

module.exports = router;
