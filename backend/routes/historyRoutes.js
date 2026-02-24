const express = require('express');
const router = express.Router();
const { getHistory, deleteHistory, toggleFavorite } = require('../controllers/historyController');
const verifyJWT = require('../middleware/auth');

// GET all summaries
router.get('/', verifyJWT, getHistory);

// DELETE a summary by ID
router.delete('/:id', verifyJWT, deleteHistory);

// PATCH toggle favorite status
router.patch('/:id/favorite', verifyJWT, toggleFavorite);

module.exports = router;
