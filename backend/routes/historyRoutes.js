const express = require('express');
const router = express.Router();
const { getHistory, deleteHistory } = require('../controllers/historyController');
const verifyJWT = require('../middleware/auth');

// GET all summaries
router.get('/', verifyJWT, getHistory);

// DELETE a summary by ID
router.delete('/:id', verifyJWT, deleteHistory);

module.exports = router;
