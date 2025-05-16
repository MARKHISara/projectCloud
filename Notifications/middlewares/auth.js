// Middleware d'authentification pour le service de notifications
const jwt = require('jsonwebtoken');

// Clé secrète pour signer les tokens JWT (à stocker dans .env en production)
const JWT_SECRET = 'notification_system_secret_key';

// Middleware de vérification de token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.query.token;

  if (!token) {
    return res.status(401).json({ error: 'Accès non autorisé, token manquant' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};

// Générer un token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Middleware de vérification de rôle (optionnel)
const verifyRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      return next();
    }
    return res.status(403).json({ error: 'Accès refusé, rôle requis: ' + role });
  };
};

module.exports = {
  verifyToken,
  generateToken,
  verifyRole,
  JWT_SECRET
};
