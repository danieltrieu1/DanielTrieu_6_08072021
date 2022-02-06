// Package permettant de créer et vérifier un token d'authentificaton
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {

    // Extraction du token contenu dans le header Authorization
    // .split(): Bearer / Récupération du contenu après l'espace
    const token = req.headers.authorization.split(' ')[1];

    // .verify(): Décodage du token -> Renverra une erreur si celui-ci n'est pas valide
    const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);

    // Extraction de l'id contenu dans le token
    const userId = decodedToken.userId;

    req.auth = { userId };  

    // Comparaison de l'id de l'utilisateur avec celui extrait du token
    if (req.body.userId && req.body.userId !== userId) {

      throw 'Invalid user ID';
      
    } else {

      // Exécution de l'authentification
      next();
    }
  
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};