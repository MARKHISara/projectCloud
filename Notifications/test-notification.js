const express = require("express");
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

// Créer l'application Express
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Stockage temporaire des notifications (en mémoire)
const notifications = [];

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log(`🔌 Nouvelle connexion Socket.IO: ${socket.id}`);
  
  // Authentification simplifiée
  socket.on('authenticate', (authData) => {
    console.log('👤 Authentification avec:', authData);
    
    if (authData && authData.userId) {
      socket.userId = authData.userId;
      socket.join(`user:${authData.userId}`);
      
      // Envoyer les notifications existantes pour cet utilisateur
      const userNotifications = notifications.filter(n => n.user_id === authData.userId);
      if (userNotifications.length > 0) {
        socket.emit('unread_notifications', userNotifications);
      }
      
      console.log(`👤 Utilisateur ${authData.userId} authentifié`);
    }
  });
  
  socket.on('disconnect', () => {
    console.log(`🔌 Déconnexion Socket.IO: ${socket.id}`);
  });
});

// Route de test pour vérifier si le service fonctionne
app.get("/", (req, res) => {
  res.send("🟢 Service de notifications test actif");
});

// Route pour envoyer une notification test
app.post('/notify-test', async (req, res) => {
  const { user_id, message } = req.body;

  if (!user_id || !message) {
    return res.status(400).json({ error: "Données manquantes : user_id et message requis" });
  }

  try {
    // Créer une notification en mémoire
    const newNotification = {
      _id: Date.now().toString(),
      user_id,
      message,
      is_read: false,
      created_at: new Date()
    };
    
    // Stocker la notification
    notifications.push(newNotification);

    // Émettre la notification via Socket.IO
    io.to(`user:${user_id}`).emit('new_notification', newNotification);

    console.log(`📩 Notification envoyée pour l'utilisateur ${user_id}: ${message}`);

    return res.status(200).json({ 
      success: true,
      message: "Notification envoyée avec succès", 
      notification: newNotification 
    });
  } catch (err) {
    console.error("❌ Erreur:", err);
    return res.status(500).json({ error: "Erreur lors de l'envoi de la notification" });
  }
});

// Démarrer le serveur
const PORT = process.env.PORT || 5003;
server.listen(PORT, () => {
  console.log(`🚀 Serveur de test des notifications démarré sur le port ${PORT}`);
});
