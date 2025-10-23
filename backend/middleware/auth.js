const jwt = require('jsonwebtoken');

module.exports = function verifyJWT(req, res, next) {
  try {
    const token = req.cookies && req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
