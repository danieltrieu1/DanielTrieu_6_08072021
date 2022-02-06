const express = require('express');

// Package permettant de faciliter les interactions entre Express et la bdd MongoDB
// Validation / Gestion / Lecture et écriture des documents
const mongoose = require('mongoose');

// Permet la gestion des requêtes vers le dossier /images
const path = require('path');

// Variable d'environnement
require('dotenv').config();

// Utilisation des modèles
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

// Sécurisation des en-têtes http: Préventions contre les attaques XSS
const helmet = require('helmet');

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));


// Paramétrage des en-têtes
// app.use(): permet d'attribuer un middleware à une route spécifique de l'application
app.use((req, res, next) => {

  // Permet l'accès à notre API depuis n'importe quelle origine "*"
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Permet l'ajout des en-têtes mentionnés aux requêtes envoyées vers l'API
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );

  // Permet l'envoi des requêtes avec les méthodes mentionnées
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Récupération des requêtes du body au format JSON
app.use(express.json());

// Gestion des fichiers images de manière statique
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

// Export
module.exports = app;