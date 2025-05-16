// Script d'initialisation de la base de données MongoDB pour les notifications
const mongoose = require('mongoose');
const Notification = require('../models/Notification');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/notifications')
  .then(async () => {
    console.log('✅ Connexion MongoDB réussie');
    
    try {
      // Création d'un index sur le champ user_id pour des requêtes plus rapides
      await Notification.collection.createIndex({ user_id: 1 });
      console.log('✅ Index sur user_id créé avec succès');
      
      // Index sur is_read pour filtrer rapidement les notifications non lues
      await Notification.collection.createIndex({ is_read: 1 });
      console.log('✅ Index sur is_read créé avec succès');
      
      // Index sur created_at pour le tri chronologique
      await Notification.collection.createIndex({ created_at: -1 });
      console.log('✅ Index sur created_at créé avec succès');
      
      // Index composé pour rechercher rapidement les notifications non lues d'un utilisateur
      await Notification.collection.createIndex({ user_id: 1, is_read: 1 });
      console.log('✅ Index composé sur user_id et is_read créé avec succès');
      
      console.log('✅ Initialisation de la base de données terminée');
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
    } finally {
      // Fermer la connexion
      mongoose.connection.close();
    }
  })
  .catch(err => {
    console.error('❌ Erreur de connexion MongoDB:', err);
  });
