const express = require('express');
const { summarizeText } = require('../controllers/summaryController');
const verifyJWT = require('../middleware/auth');

const router = express.Router();

router.post('/', verifyJWT, summarizeText);

module.exports = router;