// Script pour vérifier les utilisateurs dans la base de données
const mongoose = require('mongoose');
const User = require('../models/User');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/notifications')
  .then(async () => {
    console.log('✅ Connexion MongoDB réussie');
    
    try {
      // Lister tous les utilisateurs
      const users = await User.find({}).select('-password');
      console.log(`📋 ${users.length} utilisateur(s) trouvé(s) dans la base de données:`);
      
      if (users.length === 0) {
        console.log('❌ Aucun utilisateur dans la base de données');
      } else {
        users.forEach((user, index) => {
          console.log(`\n👤 Utilisateur #${index + 1}:`);
          console.log(`  ID: ${user._id}`);
          console.log(`  Email: ${user.email}`);
          console.log(`  Nom: ${user.name}`);
          console.log(`  Rôle: ${user.role}`);
          console.log(`  Créé le: ${user.created_at}`);
        });
      }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des utilisateurs:', error);
    } finally {
      // Fermer la connexion
      mongoose.connection.close();
      console.log('\n👋 Connexion MongoDB fermée');
    }
  })
  .catch(err => {
    console.error('❌ Erreur de connexion MongoDB:', err);
  });
