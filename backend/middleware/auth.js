const jwt = require('jsonwebtoken');

module.exports = function verifyJWT(req, res, next) {
  try {
    const token = req.cookies && req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token payload' });
    }

    req.user = { id: decoded.id };
    next();
  } catch (err) {
    console.error('JWT verification error:', err.message);
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
};
