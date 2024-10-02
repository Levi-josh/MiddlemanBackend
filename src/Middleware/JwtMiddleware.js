const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const token = req?.cookies?.jwt 
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  try {
    jwt.verify(token, process.env.Access_Token, (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = decoded;
        next();  
      })
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  } 
};

module.exports = authenticateJWT;
