// consumer.js
const amqp = require("amqplib");
const Notification = require("./models/Notification");

// Utilisation d'une variable d'environnement ou une URL cloud par défaut
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672';
const EXCHANGE_NAME = 'orders_events'; // Échange pour les événements liés aux commandes
const QUEUE_NAME = 'notifications'; // File pour les notifications
const MENU_EXCHANGE_NAME = 'menu_events'; // Échange pour les événements liés aux menus
const FOOD_EXCHANGE_NAME = 'food_exchange'; // Échange pour les notifications food depuis Laravel
const FOOD_NOTIFICATIONS_QUEUE = 'food_notifications_queue'; // File pour les notifications food

// Utilisation d'une fonction factory pour injecter l'instance Socket.IO
module.exports = function(io) {
  // Fonction pour émettre une notification à un utilisateur spécifique
  const emitNotification = (userId, notification) => {
    // Émettre à une room spécifique à l'utilisateur
    io.to(`user:${userId}`).emit('new_notification', notification);
    console.log(`🔔 Notification émise à l'utilisateur ${userId}`);
  };

  // Fonction pour consommer les messages de RabbitMQ
  const consumeNotificationEvents = async () => {
    try {
      // Connexion à RabbitMQ
      const connection = await amqp.connect(RABBITMQ_URL);
      console.log('🐰 Connecté à RabbitMQ');

      // Gestion de la fermeture de connexion
      connection.on('error', (err) => {
        console.error('❌ Erreur de connexion RabbitMQ:', err.message);
        setTimeout(consumeNotificationEvents, 5000); // Tentative de reconnexion
      });

      connection.on('close', () => {
        console.warn('⚠️ Connexion RabbitMQ fermée, tentative de reconnexion...');
        setTimeout(consumeNotificationEvents, 5000);
      });

      // Création d'un canal
      const channel = await connection.createChannel();

      // Configuration de l'échange et de la file d'attente
      await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
      await channel.assertExchange(MENU_EXCHANGE_NAME, 'topic', { durable: true });
      await channel.assertExchange(FOOD_EXCHANGE_NAME, 'direct', { durable: true });
      await channel.assertQueue(QUEUE_NAME, { durable: true });
      await channel.assertQueue(FOOD_NOTIFICATIONS_QUEUE, { durable: true });
      
      // Binding la file à l'échange avec des clés de routage
      await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'order.created');
      await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'order.updated');
      
      // Binding pour les événements liés aux menus
      await channel.bindQueue(QUEUE_NAME, MENU_EXCHANGE_NAME, 'menu.ordered');
      await channel.bindQueue(QUEUE_NAME, MENU_EXCHANGE_NAME, 'menu.prepared');
      await channel.bindQueue(QUEUE_NAME, MENU_EXCHANGE_NAME, 'menu.delivered');
      
      // Binding pour les notifications food depuis Laravel
      await channel.bindQueue(FOOD_NOTIFICATIONS_QUEUE, FOOD_EXCHANGE_NAME, 'food_notifications');
      await channel.bindQueue(FOOD_NOTIFICATIONS_QUEUE, FOOD_EXCHANGE_NAME, 'food_orders');

      console.log(`📥 En attente de messages dans les files "${QUEUE_NAME}" et "${FOOD_NOTIFICATIONS_QUEUE}"...`);

      // Consommation des messages de la file principale
      channel.consume(QUEUE_NAME, async (msg) => {
        if (msg) {
          try {
            // Analyser le contenu du message
            const data = JSON.parse(msg.content.toString());
            const routingKey = msg.fields.routingKey;
            
            console.log(`📩 Message reçu avec la clé ${routingKey} : `, data);

            // Créer un message adapté selon le type d'événement
            let message = '';
            switch (routingKey) {
              case 'order.created':
                message = `Nouvelle commande #${data.order_id} créée`;
                break;
              case 'order.updated':
                message = `La commande #${data.order_id} a été mise à jour`;
                break;
              case 'menu.ordered':
                message = `Votre commande de menu #${data.menu_id} a été reçue! 🍽️`;
                break;
              case 'menu.prepared':
                message = `Votre menu #${data.menu_id} est prêt! 👨‍🍳`;
                break;
              case 'menu.delivered':
                message = `Votre menu #${data.menu_id} a été livré. Bon appétit! 🚚`;
                break;
              default:
                message = data.message || 'Nouvelle notification';
            }

            // Enregistrer la notification dans MongoDB
            const newNotification = await Notification.create({
              user_id: data.user_id,
              message: message,
              is_read: false,
              created_at: new Date(),
              data: data // Stocker les données complètes de la commande
            });

            // Émettre la notification via Socket.IO
            emitNotification(data.user_id, newNotification);

            // Confirmer le traitement du message
            channel.ack(msg);
          } catch (err) {
            console.error('❌ Erreur lors du traitement du message:', err);
            channel.ack(msg); // On ack quand même pour éviter les boucles infinies
          }
        }
      }, {
        // Configuration supplémentaire pour la consommation
        noAck: false // Require explicit acknowledgments
      });

      // Consommation des messages de la file food_notifications
      channel.consume(FOOD_NOTIFICATIONS_QUEUE, async (msg) => {
        if (msg) {
          try {
            // Analyser le contenu du message
            const data = JSON.parse(msg.content.toString());
            const routingKey = msg.fields.routingKey;
            
            console.log(`🍽️ Message Food reçu avec la clé ${routingKey} : `, data);

            // Créer un message adapté selon le type de notification food
            let message = '';
            switch (data.type) {
              case 'food_notification':
                message = `${data.title}: ${data.message}`;
                break;
              case 'order_notification':
                message = `Commande ${data.order_id} - Statut: ${data.status}`;
                break;
              default:
                message = data.message || data.title || 'Nouvelle notification food';
            }

            // Enregistrer la notification dans MongoDB
            const newNotification = await Notification.create({
              user_id: data.user_id,
              message: message,
              is_read: false,
              created_at: new Date(),
              data: data // Stocker les données complètes
            });

            // Émettre la notification via Socket.IO
            emitNotification(data.user_id, newNotification);

            // Confirmer le traitement du message
            channel.ack(msg);
          } catch (err) {
            console.error('❌ Erreur lors du traitement du message food:', err);
            channel.ack(msg); // On ack quand même pour éviter les boucles infinies
          }
        }
      }, {
        // Configuration supplémentaire pour la consommation
        noAck: false // Require explicit acknowledgments
      });

    } catch (err) {
      console.error("❌ Erreur initialisation consumer RabbitMQ:", err.message);
      setTimeout(consumeNotificationEvents, 5000); // Tentative de reconnexion
    }
  };

  return consumeNotificationEvents;
};
