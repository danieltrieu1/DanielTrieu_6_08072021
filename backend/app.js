//
const express = require('express');

//
const mongoose = require('mongoose');

//
const path = require('path');

// Variable d'environnement
require('dotenv').config()

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

mongoose
  .connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

// Sécurisation des en-têtes http
const helmet = require('helmet');

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));


// Paramétrage des en-têtes
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Récupération des requêtes du body en format JSON
app.use(express.json());

// Gestion des fichiers images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);


// Export
module.exports = app;