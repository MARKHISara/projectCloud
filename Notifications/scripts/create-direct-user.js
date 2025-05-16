// Script pour créer un utilisateur avec mot de passe en clair (temporaire pour test)
const mongoose = require('mongoose');
const { generateToken } = require('../middlewares/auth');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/notifications')
  .then(async () => {
    console.log('✅ Connexion MongoDB réussie');
    
    try {
      // Créer l'utilisateur directement dans la base de données
      const result = await mongoose.connection.db.collection('users').insertOne({
        email: 'direct@example.com',
        password: 'demo123', // ⚠️ MOT DE PASSE EN CLAIR - UNIQUEMENT POUR TEST
        name: 'Utilisateur Direct',
        role: 'user',
        created_at: new Date()
      });
      
      console.log('✅ Utilisateur créé directement dans la base de données');
      console.log('📝 Informations utilisateur :', {
        id: result.insertedId,
        email: 'direct@example.com',
        name: 'Utilisateur Direct',
        password: 'demo123' // Ne jamais afficher le mot de passe en production!
      });
      
      // Générer un token JWT pour cet utilisateur
      const token = generateToken({ 
        id: result.insertedId.toString(), 
        email: 'direct@example.com',
        role: 'user'
      });
      console.log('\n🔑 TOKEN JWT (à utiliser directement) :\n', token);
      
      // Créer un endpoint de test pour cet utilisateur
      console.log('\n📋 Pour tester les notifications avec ce token:');
      console.log(`
POST http://localhost:5003/notify
Authorization: Bearer ${token}
Content-Type: application/json

{
  "user_id": "${result.insertedId}",
  "message": "Notification de test avec autorisation"
}
      `);
      
      // Créer une requête de test pour la route publique
      console.log('\n📋 Pour tester sans authentification:');
      console.log(`
POST http://localhost:5003/notify-public
Content-Type: application/json

{
  "user_id": "${result.insertedId}",
  "message": "Notification publique de test"
}
      `);
      
    } catch (error) {
      console.error('❌ Erreur lors de la création de l\'utilisateur direct:', error);
    } finally {
      // Fermer la connexion
      mongoose.connection.close();
      console.log('👋 Connexion MongoDB fermée');
    }
  })
  .catch(err => {
    console.error('❌ Erreur de connexion MongoDB:', err);
  });
