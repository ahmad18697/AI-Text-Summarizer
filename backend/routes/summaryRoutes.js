const express = require('express');
const { summarizeText } = require('../controllers/summaryController');

const router = express.Router();

router.post('/', summarizeText);

module.exports = router;