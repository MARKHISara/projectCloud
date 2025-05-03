require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');


const authRoutes = require('./routes/auth');

app.use(express.json());
app.use(cors());
const PORT = 5000;

app.use(express.json());
app.use(cors());


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connecté !'))
  .catch((err) => console.log('Erreur de connexion MongoDB :', err));

app.use('/api/auth', authRoutes);

app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
