// Route d'authentification directe (contournement temporaire)
const express = require('express');
const router = express.Router();
const { generateToken } = require('../middlewares/auth');
const mongoose = require('mongoose');

// Route d'inscription directe
router.post('/register', async (req, res) => {
  try {
    console.log('👉 Tentative d\'inscription directe avec:', req.body);
    const { name, email, password, role } = req.body;

    // Vérifier que les champs nécessaires sont présents
    if (!name || !email || !password) {
      console.log('❌ Champs manquants');
      return res.status(400).json({ error: 'Veuillez fournir un nom, un email et un mot de passe' });
    }

    // Vérifier si l'utilisateur existe déjà
    const usersCollection = mongoose.connection.db.collection('users');
    const existingUser = await usersCollection.findOne({ email });
    
    if (existingUser) {
      console.log('❌ Email déjà utilisé:', email);
      return res.status(409).json({ error: 'Cet email est déjà utilisé' });
    }

    // Créer un nouvel utilisateur directement dans la collection
    const result = await usersCollection.insertOne({
      name,
      email,
      password, // Stockage direct du mot de passe sans hachage (uniquement pour développement)
      role: role || 'user',
      created_at: new Date()
    });

    console.log('✅ Utilisateur créé avec succès:', email);

    // Générer un token JWT
    const userId = result.insertedId.toString();
    const token = generateToken({ id: userId, email, role: role || 'user' });

    res.status(201).json({
      message: 'Inscription réussie',
      user: {
        id: userId,
        email,
        name,
        role: role || 'user'
      },
      token
    });
  } catch (error) {
    console.error('❌ Erreur lors de l\'inscription directe:', error);
    res.status(500).json({ error: 'Erreur serveur lors de l\'inscription' });
  }
});

// Route de connexion directe (sans vérification de mot de passe hachée)
router.post('/login', async (req, res) => {
  try {
    console.log('👉 Tentative de connexion directe avec:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('❌ Email ou mot de passe manquant');
      return res.status(400).json({ error: 'Veuillez fournir un email et un mot de passe' });
    }

    // Recherche directe dans la collection users avec le bon mot de passe en clair
    const usersCollection = mongoose.connection.db.collection('users');
    const user = await usersCollection.findOne({ 
      email: email,
      password: password  // Recherche directe avec le mot de passe en clair
    });

    console.log('🔍 Recherche utilisateur directe:', user ? 'Trouvé' : 'Non trouvé');
    
    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Génération du token JWT
    const token = generateToken({ 
      id: user._id.toString(), 
      email: user.email,
      role: user.role || 'user'
    });

    console.log('✅ Connexion directe réussie pour:', email);

    // Envoi de la réponse
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
    console.error('❌ Erreur lors de la connexion directe:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
  }
});

module.exports = router;
