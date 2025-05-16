// test-menu-notification.js
const amqp = require("amqplib");

// Utilisation d'une variable d'environnement ou une URL cloud par défaut
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqps://username:password@beaver.rmq.cloudamqp.com/username';
const MENU_EXCHANGE_NAME = 'menu_events'; // Échange pour les événements liés aux menus

// Fonction pour se connecter à RabbitMQ et envoyer un message
async function sendMenuNotification(routingKey, data) {
  try {
    // Connexion à RabbitMQ
    const connection = await amqp.connect(RABBITMQ_URL);
    console.log('🐰 Connecté à RabbitMQ');

    // Création d'un canal
    const channel = await connection.createChannel();

    // Configuration de l'échange
    await channel.assertExchange(MENU_EXCHANGE_NAME, 'topic', { durable: true });

    // Publication du message
    const message = Buffer.from(JSON.stringify(data));
    const result = channel.publish(MENU_EXCHANGE_NAME, routingKey, message);

    console.log(`📨 Message envoyé avec la clé ${routingKey}:`, data);
    console.log(`Résultat de la publication: ${result ? 'Succès' : 'Échec'}`);

    // Fermeture de la connexion après 1 seconde
    setTimeout(() => {
      connection.close();
      console.log('📡 Connexion RabbitMQ fermée');
    }, 1000);

    return result;
  } catch (err) {
    console.error("❌ Erreur lors de l'envoi du message:", err.message);
    throw err;
  }
}

// Fonction principale pour gérer les arguments de ligne de commande
async function main() {
  try {
    const args = process.argv.slice(2);
    let routingKey = 'menu.ordered'; // Par défaut
    let user_id = '1'; // ID utilisateur par défaut
    let menu_id = '1'; // ID menu par défaut

    // Traitement des arguments
    args.forEach(arg => {
      if (arg.startsWith('--event=')) {
        const event = arg.split('=')[1];
        if (['ordered', 'prepared', 'delivered'].includes(event)) {
          routingKey = `menu.${event}`;
        }
      } else if (arg.startsWith('--user=')) {
        user_id = arg.split('=')[1];
      } else if (arg.startsWith('--menu=')) {
        menu_id = arg.split('=')[1];
      }
    });

    // Construction des données
    const data = {
      user_id: user_id,
      menu_id: menu_id,
      timestamp: new Date().toISOString(),
      details: {
        status: routingKey.split('.')[1],
        items: ['Item 1', 'Item 2'],
        price: 15.99
      }
    };

    // Envoi de la notification
    await sendMenuNotification(routingKey, data);
    console.log('✅ Test de notification terminé avec succès');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    process.exit(1);
  }
}

// Démarrage du script
main();
