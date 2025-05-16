// Script pour tester directement l'authentification
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generateToken } = require('../middlewares/auth');

// Fonction pour tester la connexion avec des identifiants
async function testLogin(email, password) {
  console.log(`\n🔍 Test de connexion pour l'email: ${email}`);
  
  try {
    // Trouver l'utilisateur par email
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('❌ Utilisateur non trouvé');
      return { success: false, error: 'Utilisateur non trouvé' };
    }
    
    console.log('✅ Utilisateur trouvé:', {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    });
    
    // Tester directement la méthode de comparaison de mot de passe
    console.log('🔐 Test de la méthode comparePassword...');
    const isPasswordValid = await user.comparePassword(password);
    console.log(`🔐 Résultat de comparePassword: ${isPasswordValid ? 'Succès' : 'Échec'}`);
    
    // Vérification manuelle avec bcrypt.compare
    console.log('🔐 Test direct avec bcrypt.compare...');
    const directCompare = await bcrypt.compare(password, user.password);
    console.log(`🔐 Résultat de bcrypt.compare: ${directCompare ? 'Succès' : 'Échec'}`);
    
    // Si le mot de passe est valide, générer un token
    if (isPasswordValid) {
      const token = generateToken({ id: user._id, email: user.email, role: user.role });
      console.log('✅ Authentification réussie, token généré');
      return { success: true, user, token };
    } else {
      console.log('❌ Mot de passe incorrect');
      return { success: false, error: 'Mot de passe incorrect' };
    }
  } catch (error) {
    console.error('❌ Erreur lors du test d\'authentification:', error);
    return { success: false, error: error.message };
  }
}

// Fonction principale
async function main() {
  try {
    // Connexion à MongoDB
    await mongoose.connect('mongodb://localhost:27017/notifications');
    console.log('✅ Connexion MongoDB réussie');
    
    // Test avec l'utilisateur de test créé précédemment
    const testResult = await testLogin('test@example.com', 'motdepasse123');
    
    if (testResult.success) {
      console.log('\n✅ TEST RÉUSSI: Authentification réussie');
      console.log('Token JWT:', testResult.token);
    } else {
      console.log('\n❌ TEST ÉCHOUÉ: Authentification échouée');
      console.log('Raison:', testResult.error);
    }
    
    // Test de création directe d'un utilisateur pour voir si cela résout le problème
    if (!testResult.success) {
      console.log('\n🔧 Tentative de correction: création d\'un nouvel utilisateur de test');
      
      // Suppression de l'utilisateur existant
      await User.deleteOne({ email: 'test2@example.com' });
      
      // Création d'un nouvel utilisateur avec mot de passe pré-hashé
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('test123', salt);
      
      const newUser = await User.create({
        email: 'test2@example.com',
        password: hashedPassword,
        name: 'Utilisateur Test 2',
        role: 'user'
      });
      
      console.log('✅ Nouvel utilisateur créé:', {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name
      });
      
      // Test avec le nouvel utilisateur
      const newTestResult = await testLogin('test2@example.com', 'test123');
      
      if (newTestResult.success) {
        console.log('\n✅ TEST RÉUSSI avec le nouvel utilisateur');
        console.log('Identifiants valides:');
        console.log('  Email: test2@example.com');
        console.log('  Mot de passe: test123');
      } else {
        console.log('\n❌ TEST ÉCHOUÉ même avec le nouvel utilisateur');
        console.log('Le problème semble être plus profond dans l\'implémentation');
      }
    }
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  } finally {
    // Fermer la connexion
    await mongoose.connection.close();
    console.log('\n👋 Connexion MongoDB fermée');
  }
}

// Exécuter le test
main();
