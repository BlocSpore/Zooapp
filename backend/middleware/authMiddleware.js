// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ error: 'Token manquant, accès non autorisé' });

  jwt.verify(token, process.env.JWT_SECRET || 'souris', (err, user) => {
    if (err) return res.status(403).json({ error: 'Token invalide, accès interdit' });
    req.user = user;
    next();
  });
}

function authorizeRole(roles) {
  return (req, res, next) => {
    console.log('Rôles acceptés :', roles);
    console.log('Rôle de l\'utilisateur :', req.user.role);
    if (!roles.includes(req.user.role)) {
      console.error('Accès interdit - Rôle insuffisant');
      return res.status(403).json({ error: 'Accès interdit' }); // Forbidden
    }
    next();
  };
}

module.exports = { authenticateToken, authorizeRole };
