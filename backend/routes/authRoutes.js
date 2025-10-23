const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/auth');
const { register, login, google, me, logout } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/google', google);
router.get('/me', verifyJWT, me);
router.post('/logout', verifyJWT, logout);

module.exports = router;
