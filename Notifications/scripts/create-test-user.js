// Script pour créer un utilisateur de test
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/notifications')
  .then(async () => {
    console.log('✅ Connexion MongoDB réussie');
    
    try {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ email: 'test@example.com' });
      
      if (existingUser) {
        console.log('⚠️ Un utilisateur avec cet email existe déjà');
        console.log('📝 Informations utilisateur :', {
          id: existingUser._id,
          email: existingUser.email,
          name: existingUser.name,
          role: existingUser.role,
          created_at: existingUser.created_at
        });
      } else {
        // Hasher le mot de passe manuellement
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('motdepasse123', salt);
        
        // Créer un nouvel utilisateur
        const newUser = await User.create({
          email: 'test@example.com',
          password: hashedPassword,
          name: 'Utilisateur Test',
          role: 'user', // Utilisant 'user' qui est une valeur valide selon le modèle
          created_at: new Date()
        });
        
        console.log('✅ Utilisateur de test créé avec succès');
        console.log('📝 Informations utilisateur :', {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          created_at: newUser.created_at
        });
      }
    } catch (error) {
      console.error('❌ Erreur lors de la création de l\'utilisateur de test:', error);
    } finally {
      // Fermer la connexion
      mongoose.connection.close();
      console.log('👋 Connexion MongoDB fermée');
    }
  })
  .catch(err => {
    console.error('❌ Erreur de connexion MongoDB:', err);
  });
