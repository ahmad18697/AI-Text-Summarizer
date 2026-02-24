const express = require('express');
const multer = require('multer');
const { summarizeText, getSharedSummary } = require('../controllers/summaryController');
const verifyJWT = require('../middleware/auth');

const router = express.Router();

// Memory limits for safe file parsing (5MB)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
});

// Protect summarization route & allow one file upload
router.post('/', verifyJWT, upload.single('file'), summarizeText);

// Public route to view shared summaries (no JWT required)
router.get('/shared/:shareId', getSharedSummary);

module.exports = router;