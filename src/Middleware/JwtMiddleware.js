const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  // Extract token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract the token part

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    jwt.verify(token, process.env.Access_Token, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
      }
      req.user = decoded; // Attach decoded token to request
      next();
    });
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticateJWT;

