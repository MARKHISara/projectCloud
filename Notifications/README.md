# Système de Notification Fast Truck Reservation

Ce système permet d'envoyer des notifications en temps réel pour les commandes de menu. Il utilise Node.js, Express, Socket.IO et RabbitMQ pour garantir une communication fiable entre les différents services.

## Architecture

Le système de notification est composé de plusieurs parties :

1. **Service de notification Node.js** - Serveur Express + Socket.IO qui :
   - Écoute les événements RabbitMQ
   - Stocke les notifications dans MongoDB
   - Envoie les notifications en temps réel aux clients via Socket.IO

2. **Pont Laravel** - API qui permet au backend principal de :
   - Transmettre les notifications au service Node.js
   - Tester le système de notification

3. **Frontend React** - Interface utilisateur qui :
   - Se connecte au service de notification via Socket.IO
   - Affiche les notifications en temps réel
   - Permet aux utilisateurs de marquer les notifications comme lues

## Flux de données

1. Quand un client passe une commande de menu dans le frontend, une requête est envoyée à l'API Laravel
2. L'API Laravel traite la commande et envoie une notification à l'API du service de notification
3. Le service de notification enregistre la notification dans MongoDB et la publie sur RabbitMQ
4. Le consumer RabbitMQ reçoit le message et envoie la notification en temps réel aux clients connectés via Socket.IO
5. Le client reçoit la notification et l'affiche à l'utilisateur

## États des commandes de menu

Le système gère trois états pour les commandes de menu :

1. **ordered** - La commande a été reçue
2. **prepared** - Le menu est prêt
3. **delivered** - Le menu a été livré

## Comment tester le système

### 1. Démarrer les services

Assurez-vous que les services suivants sont en cours d'exécution :

```bash
# Dans le dossier Notifications
npm install
node server.js
```

### 2. Tester avec le script de test

Utilisez le script `test-menu-order.js` pour simuler des notifications :

```bash
# Simuler une commande reçue
node test-menu-order.js --user=1 --menu=123 --status=ordered

# Simuler un menu prêt
node test-menu-order.js --user=1 --menu=123 --status=prepared

# Simuler une livraison
node test-menu-order.js --user=1 --menu=123 --status=delivered
```

### 3. Tester via l'API Laravel

Vous pouvez aussi tester via les routes API de Laravel :

```bash
# Simuler une commande
curl -X POST http://localhost:8000/api/menu-notification \
  -H "Content-Type: application/json" \
  -d '{"user_id": "1", "menu_id": "123", "status": "ordered"}'
```

Ou utilisez la route de test dans votre navigateur :
```
http://localhost:8000/api/test-notification?user_id=1&menu_id=123&status=ordered
```

## Résolution des problèmes courants

### Le serveur Node.js ne démarre pas

- Vérifiez que MongoDB est accessible
- Vérifiez que RabbitMQ est accessible
- Vérifiez les variables d'environnement

### Aucune notification reçue dans le frontend

- Vérifiez que le serveur Socket.IO est en cours d'exécution
- Vérifiez que l'URL du serveur est correcte dans `notificationService.js`
- Vérifiez que l'utilisateur est connecté et que son ID est disponible

### Les notifications sont envoyées mais pas affichées

- Vérifiez que la connexion Socket.IO est établie (voir les logs du navigateur)
- Vérifiez que le composant NotificationListener est correctement intégré dans l'application
- Vérifiez que Toast est configuré correctement

## Variables d'environnement

Pour configurer le système en production, utilisez les variables d'environnement suivantes :

### Service Node.js

```
MONGODB_URI=mongodb://username:password@hostname/database
RABBITMQ_URL=amqps://username:password@hostname/vhost
JWT_SECRET=votre_secret_jwt
```

### API Laravel

```
NOTIFICATION_SERVER_URL=http://hostname:port
```

---

Pour toute question ou assistance supplémentaire, consultez la documentation complète ou contactez l'équipe de développement.
