#!/usr/bin/env node
/**
 * Script de test pour envoyer des notifications de menu
 * Usage:
 *  node test-menu-order.js --user=1 --menu=123 --status=ordered
 */

const amqp = require('amqplib');
const axios = require('axios');

// Configuration
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqps://username:password@beaver.rmq.cloudamqp.com/username';
const NOTIFICATION_SERVER_URL = process.env.NOTIFICATION_SERVER_URL || 'http://localhost:3000';
const MENU_EXCHANGE_NAME = 'menu_events';

// Fonction pour envoyer une notification par HTTP
async function sendNotificationHttp(userId, menuId, status) {
  console.log(`🌐 Envoi de notification HTTP: user=${userId}, menu=${menuId}, status=${status}`);
  
  try {
    const response = await axios.post(`${NOTIFICATION_SERVER_URL}/menu-notification`, {
      user_id: userId,
      menu_id: menuId,
      status: status
    });
    
    console.log('✅ Notification HTTP envoyée avec succès:');
    console.log(response.data);
    
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi HTTP:', error.message);
    if (error.response) {
      console.error('Détails:', error.response.data);
    }
    return false;
  }
}

// Fonction pour envoyer une notification directement à RabbitMQ
async function sendNotificationRabbitMQ(userId, menuId, status) {
  console.log(`🐰 Envoi direct à RabbitMQ: user=${userId}, menu=${menuId}, status=${status}`);
  
  try {
    // Connexion à RabbitMQ
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    
    // Configurer l'échange
    await channel.assertExchange(MENU_EXCHANGE_NAME, 'topic', { durable: true });
    
    // Données à envoyer
    const data = {
      user_id: userId,
      menu_id: menuId,
      timestamp: new Date().toISOString(),
      details: {
        status: status
      }
    };
    
    // Clé de routage et publication
    const routingKey = `menu.${status}`;
    const message = Buffer.from(JSON.stringify(data));
    const result = channel.publish(MENU_EXCHANGE_NAME, routingKey, message);
    
    console.log(`✅ Message envoyé à RabbitMQ avec la clé ${routingKey}`);
    console.log('Données:', JSON.stringify(data, null, 2));
    
    // Fermer la connexion après un court délai
    setTimeout(() => {
      connection.close();
      console.log('📡 Connexion RabbitMQ fermée');
    }, 500);
    
    return result;
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi à RabbitMQ:', error.message);
    return false;
  }
}

// Fonction principale
async function main() {
  try {
    // Traitement des arguments
    const args = process.argv.slice(2);
    let method = 'both'; // Par défaut, essayer les deux méthodes
    let userId = '1';
    let menuId = 'test-' + Date.now();
    let status = 'ordered';
    
    // Analyse des arguments
    args.forEach(arg => {
      if (arg.startsWith('--user=')) {
        userId = arg.split('=')[1];
      } else if (arg.startsWith('--menu=')) {
        menuId = arg.split('=')[1];
      } else if (arg.startsWith('--status=')) {
        const requestedStatus = arg.split('=')[1];
        if (['ordered', 'prepared', 'delivered'].includes(requestedStatus)) {
          status = requestedStatus;
        } else {
          console.warn(`⚠️ Status invalide: ${requestedStatus}. Utilisation de la valeur par défaut: ${status}`);
        }
      } else if (arg.startsWith('--method=')) {
        const requestedMethod = arg.split('=')[1];
        if (['http', 'rabbitmq', 'both'].includes(requestedMethod)) {
          method = requestedMethod;
        }
      } else if (arg === '--help' || arg === '-h') {
        showHelp();
        process.exit(0);
      }
    });
    
    // Exécuter les méthodes selon la configuration
    let httpResult = true, rabbitResult = true;
    
    console.log(`🚀 Exécution du test de notification de menu...`);
    console.log(`📋 Configuration: user=${userId}, menu=${menuId}, status=${status}, method=${method}`);
    
    if (method === 'http' || method === 'both') {
      httpResult = await sendNotificationHttp(userId, menuId, status);
    }
    
    if (method === 'rabbitmq' || method === 'both') {
      rabbitResult = await sendNotificationRabbitMQ(userId, menuId, status);
    }
    
    // Résumé
    console.log('\n📊 Résumé du test:');
    if (method === 'http' || method === 'both') {
      console.log(`- HTTP API: ${httpResult ? '✅ Succès' : '❌ Échec'}`);
    }
    if (method === 'rabbitmq' || method === 'both') {
      console.log(`- RabbitMQ: ${rabbitResult ? '✅ Succès' : '❌ Échec'}`);
    }
    
    // Test suivant
    if (status !== 'delivered') {
      const nextStatus = status === 'ordered' ? 'prepared' : 'delivered';
      console.log(`\n💡 Conseil: Pour tester l'étape suivante (${nextStatus}), exécutez:`);
      console.log(`node test-menu-order.js --user=${userId} --menu=${menuId} --status=${nextStatus}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution du test:', error);
    process.exit(1);
  }
}

// Affichage de l'aide
function showHelp() {
  console.log(`
📋 Script de test pour les notifications de menu
Usage: node test-menu-order.js [options]

Options:
  --user=ID        ID de l'utilisateur destinataire (défaut: 1)
  --menu=ID        ID du menu concerné (défaut: timestamp généré)
  --status=STATUS  Status de la commande (ordered, prepared, delivered) (défaut: ordered)
  --method=METHOD  Méthode d'envoi (http, rabbitmq, both) (défaut: both)
  --help, -h       Affiche cette aide

Exemples:
  node test-menu-order.js --user=1 --menu=123 --status=ordered
  node test-menu-order.js --user=2 --menu=456 --status=prepared --method=http
  `);
}

// Exécution du script
main();
