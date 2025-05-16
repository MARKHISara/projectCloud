const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const Notification = require("./models/Notification");
const authRoutes = require('./routes/auth');
const directAuthRoutes = require('./routes/direct-auth');
const { verifyToken, JWT_SECRET } = require('./middlewares/auth');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://food:5173", "http://localhost:5173", "http://laravel:8000"], // Origines autorisées
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: ["http://food:5173", "http://localhost:5173", "http://laravel:8000"],
  credentials: true
})); // Configure CORS avec plus de précision
app.use(express.json());

// Enregistrer les routes d'authentification
app.use('/auth', authRoutes);

// Enregistrer les routes d'authentification directe (pour contourner temporairement le problème de hachage)
app.use('/direct-auth', directAuthRoutes);

// Connexion à MongoDB
// Utilisation de la connexion MongoDB configurée pour Docker
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://mongo:27017/notifications";

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Connexion MongoDB réussie");
    // Passer l'instance Socket.IO au consommateur
    const consumeNotificationEvents = require("./consumer")(io);
    consumeNotificationEvents(); // Démarrer la consommation de RabbitMQ
  })
  .catch((err) => {
    console.error("❌ Erreur connexion MongoDB:", err.message);
  });

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log(`🔌 Nouvelle connexion Socket.IO: ${socket.id}`);
  
  // Authentification de l'utilisateur avec JWT
  socket.on('authenticate', (authData) => {
    try {
      // Vérifier si un token JWT est fourni
      if (authData && authData.token) {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(authData.token, JWT_SECRET);
        
        // Associer l'ID utilisateur à la connexion socket
        socket.userId = decoded.id;
        socket.user = decoded;
        
        console.log(`👤 Utilisateur ${decoded.email} (${decoded.id}) authentifié sur le socket ${socket.id}`);
        
        // Rejoindre une room spécifique à l'utilisateur
        socket.join(`user:${decoded.id}`);
        
        // Envoyer les notifications non lues
        sendUnreadNotifications(decoded.id, socket);
        
        // Confirmer l'authentification réussie
        socket.emit('authenticated', { success: true, user: { id: decoded.id, email: decoded.email } });
      } else if (authData && authData.userId) {
        // Compatibilité avec l'ancienne méthode d'authentification
        socket.userId = authData.userId;
        console.log(`👤 Utilisateur ${authData.userId} authentifié sur le socket ${socket.id} (méthode simple)`);
        
        // Rejoindre une room spécifique à l'utilisateur
        socket.join(`user:${authData.userId}`);
        
        // Envoyer les notifications non lues
        sendUnreadNotifications(authData.userId, socket);
      } else {
        // Échec d'authentification
        socket.emit('authentication_error', { error: 'Données d\'authentification invalides ou manquantes' });
      }
    } catch (error) {
      console.error('❌ Erreur d\'authentification Socket.IO:', error.message);
      socket.emit('authentication_error', { error: 'Token invalide ou expiré' });
    }
  });
  
  socket.on('disconnect', () => {
    console.log(`🔌 Déconnexion Socket.IO: ${socket.id}`);
  });
});

// Fonction pour envoyer les notifications non lues à un utilisateur
async function sendUnreadNotifications(userId, socket) {
  try {
    const unreadNotifications = await Notification.find({
      user_id: userId,
      is_read: false
    }).sort({ created_at: -1 });
    
    if (unreadNotifications.length > 0) {
      socket.emit('unread_notifications', unreadNotifications);
    }
  } catch (err) {
    console.error('❌ Erreur lors de la récupération des notifications non lues:', err);
  }
}

// Route de test pour vérifier si le service fonctionne
app.get("/", (req, res) => {
  res.send("🟢 Service de notifications actif");
});

// Route pour envoyer une notification (sécurisée par JWT)
app.post('/notify', verifyToken, async (req, res) => {
  const { user_id, message } = req.body;

  if (!user_id || !message) {
    return res.status(400).json({ error: "Données manquantes : user_id et message requis" });
  }

  try {
    // Enregistrer la notification dans MongoDB
    const newNotification = await Notification.create({
      user_id,
      message,
      is_read: false, // notification non lue par défaut
      created_by: req.user.id // ID de l'utilisateur qui a créé la notification
    });

    // Émettre la notification via Socket.IO
    io.to(`user:${user_id}`).emit('new_notification', newNotification);

    console.log(`📩 Notification envoyée pour l'utilisateur ${user_id}`);

    return res.status(200).json({ message: "Notification enregistrée avec succès", notification: newNotification });
  } catch (err) {
    console.error("❌ Erreur lors de l'enregistrement de la notification :", err);
    return res.status(500).json({ error: "Erreur lors de l'enregistrement de la notification" });
  }
});

// Route publique (sans authentification) pour tester l'envoi de notification
app.post('/notify-public', async (req, res) => {
  const { user_id, message } = req.body;

  if (!user_id || !message) {
    return res.status(400).json({ error: "Données manquantes : user_id et message requis" });
  }

  try {
    // Enregistrer la notification dans MongoDB
    const newNotification = await Notification.create({
      user_id,
      message,
      is_read: false, // notification non lue par défaut
    });

    // Émettre la notification via Socket.IO
    io.to(`user:${user_id}`).emit('new_notification', newNotification);

    console.log(`📩 Notification publique envoyée pour l'utilisateur ${user_id}`);

    return res.status(200).json({ message: "Notification publique enregistrée avec succès", notification: newNotification });
  } catch (err) {
    console.error("❌ Erreur lors de l'enregistrement de la notification publique :", err);
    return res.status(500).json({ error: "Erreur lors de l'enregistrement de la notification" });
  }
});

// Route pour les notifications de commande de menu
app.post('/menu-notification', async (req, res) => {
  const { user_id, menu_id, status } = req.body;

  if (!user_id || !menu_id || !status) {
    return res.status(400).json({ error: "Données manquantes : user_id, menu_id et status requis" });
  }

  // Vérifier que le status est valide
  if (!['ordered', 'prepared', 'delivered'].includes(status)) {
    return res.status(400).json({ error: "Status invalide. Valeurs acceptées : ordered, prepared, delivered" });
  }

  try {
    // Déterminer le message selon le status
    let message = '';
    switch (status) {
      case 'ordered':
        message = `Votre commande de menu #${menu_id} a été reçue! 🍽️`;
        break;
      case 'prepared':
        message = `Votre menu #${menu_id} est prêt! 👨‍🍳`;
        break;
      case 'delivered':
        message = `Votre menu #${menu_id} a été livré. Bon appétit! 🚚`;
        break;
    }

    // Enregistrer la notification dans MongoDB
    const newNotification = await Notification.create({
      user_id,
      message,
      is_read: false,
      data: { menu_id, status }
    });

    // Émettre la notification via Socket.IO
    io.to(`user:${user_id}`).emit('new_notification', newNotification);
    
    // Publier également sur RabbitMQ si disponible
    try {
      const amqp = require("amqplib");
      const connection = await amqp.connect(RABBITMQ_URL);
      const channel = await connection.createChannel();
      const MENU_EXCHANGE_NAME = 'menu_events';
      
      await channel.assertExchange(MENU_EXCHANGE_NAME, 'topic', { durable: true });
      
      const routingKey = `menu.${status}`;
      const messageData = {
        user_id,
        menu_id,
        timestamp: new Date().toISOString()
      };
      
      channel.publish(MENU_EXCHANGE_NAME, routingKey, Buffer.from(JSON.stringify(messageData)));
      console.log(`📨 Message envoyé à RabbitMQ: ${routingKey}`);
      
      // Fermer la connexion après un court délai
      setTimeout(() => connection.close(), 500);
    } catch (mqErr) {
      console.warn('⚠️ Impossible de publier sur RabbitMQ:', mqErr.message);
      // On continue même si RabbitMQ échoue, car la notification a été enregistrée dans MongoDB
    }

    console.log(`🍔 Notification de menu envoyée pour l'utilisateur ${user_id}, menu ${menu_id}, status ${status}`);

    return res.status(200).json({ 
      message: "Notification de menu enregistrée avec succès", 
      notification: newNotification 
    });
  } catch (err) {
    console.error("❌ Erreur lors de l'enregistrement de la notification de menu :", err);
    return res.status(500).json({ error: "Erreur lors de l'enregistrement de la notification" });
  }
});

// Route pour récupérer les notifications d'un utilisateur (sécurisée)
app.get('/notifications/:userId', verifyToken, async (req, res) => {
  try {
    // Vérifier que l'utilisateur demande ses propres notifications ou est admin
    if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Non autorisé: vous ne pouvez consulter que vos propres notifications' 
      });
    }

    const notifications = await Notification.find({
      user_id: req.params.userId
    }).sort({ created_at: -1 });
    
    res.status(200).json(notifications);
  } catch (err) {
    console.error('❌ Erreur lors de la récupération des notifications:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des notifications' });
  }
});

// Route publique pour récupérer les notifications (pour compatibilité)
app.get('/notifications-public/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({
      user_id: req.params.userId
    }).sort({ created_at: -1 });
    
    res.status(200).json(notifications);
  } catch (err) {
    console.error('❌ Erreur lors de la récupération des notifications:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des notifications' });
  }
});

// Route pour marquer une notification comme lue (sécurisée)
app.put('/notifications/:id/read', verifyToken, async (req, res) => {
  try {
    // D'abord récupérer la notification pour vérifier qu'elle appartient à l'utilisateur
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification non trouvée' });
    }
    
    // Vérifier que l'utilisateur modifie sa propre notification ou est admin
    if (notification.user_id != req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Non autorisé: vous ne pouvez modifier que vos propres notifications' 
      });
    }
    
    // Mettre à jour la notification
    const updatedNotification = await Notification.findByIdAndUpdate(
      req.params.id,
      { is_read: true },
      { new: true }
    );
    
    res.status(200).json(updatedNotification);
  } catch (err) {
    console.error('❌ Erreur lors de la mise à jour de la notification:', err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la notification' });
  }
});

// Route publique pour marquer une notification comme lue (pour compatibilité)
app.put('/notifications-public/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { is_read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification non trouvée' });
    }
    
    res.status(200).json(notification);
  } catch (err) {
    console.error('❌ Erreur lors de la mise à jour de la notification:', err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la notification' });
  }
});

// Démarrer le serveur
const PORT = process.env.PORT || 3002;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur de notifications en écoute sur le port ${PORT}`);
});
