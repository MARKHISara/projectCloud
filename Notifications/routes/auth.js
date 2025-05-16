// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken, verifyToken } = require('../middlewares/auth');

// Route d'inscription (register)
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // Vérifier si tous les champs nécessaires sont présents
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Veuillez fournir un email, un mot de passe et un nom' });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé' });
    }

    // Créer un nouvel utilisateur (le mot de passe sera hashé automatiquement via le middleware)
    const user = new User({
      email,
      password,
      name,
      role: role || 'user'
    });

    await user.save();

    // Générer un token JWT
    const token = generateToken({ id: user._id, email: user.email, role: user.role });

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('❌ Erreur d\'inscription:', error);
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
});

// Route de connexion (login)
router.post('/login', async (req, res) => {
  try {
    console.log('👉 Tentative de connexion avec:', req.body);
    const { email, password } = req.body;

    // Vérifier si l'email et le mot de passe sont fournis
    if (!email || !password) {
      console.log('❌ Email ou mot de passe manquant');
      return res.status(400).json({ error: 'Veuillez fournir un email et un mot de passe' });
    }

    // Trouver l'utilisateur par email
    const user = await User.findOne({ email });
    console.log('🔍 Recherche utilisateur avec email:', email);
    console.log('🔍 Utilisateur trouvé:', user ? 'Oui' : 'Non');
    
    if (!user) {
      console.log('❌ Utilisateur non trouvé avec email:', email);
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    console.log('🔐 Vérification du mot de passe...');
    const isPasswordValid = await user.comparePassword(password);
    console.log('🔐 Mot de passe valide:', isPasswordValid ? 'Oui' : 'Non');
    
    if (!isPasswordValid) {
      console.log('❌ Mot de passe incorrect pour:', email);
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Générer un token JWT
    const token = generateToken({ id: user._id, email: user.email, role: user.role });

    res.status(200).json({
      message: 'Connexion réussie',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('❌ Erreur de connexion:', error);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
});

// Route pour obtenir les informations de l'utilisateur courant
router.get('/me', verifyToken, async (req, res) => {
  try {
    // Cette route nécessite le middleware verifyToken, donc req.user existe
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    res.status(200).json({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération du profil:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
