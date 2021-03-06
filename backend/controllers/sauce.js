// Utlisation du modèle de mongoose
const Sauce = require("../models/Sauce");

// File System: Permet de créer et gérer les fichiers pour y stocker ou lire des informations 
const fs = require("fs");

//------------------------------------------------------------------------
// CREATE / Création de ressources
//------------------------------------------------------------------------

exports.createSauce = (req, res, next) => {

  // Analyse et converti la chaine JSON sauce en objet Javascript utilisable
  const sauceObject = JSON.parse(req.body.sauce);

  // Suppression de _id car l'utilisation du mot-clé new avec un modèle Mongoose crée par défaut un champ _id
  delete sauceObject._id;

  const sauce = new Sauce({

    // Opération spread permettant de faire une copie du req.body
    ...sauceObject,

    //req.protocol = http / req.get('host') = 'localhost:3000' // req.file.filename = nom du fichier téléchargé
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
  
    // Méthode permettant l'enregistrement de la Sauce dans la base de données
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

//------------------------------------------------------------------------
// READ / Lecture de ressources
//------------------------------------------------------------------------

exports.getAllSauces = (req, res, next) => {
  
  // find(): Renvoie un tableau contenant toutes les sauces présentes dans la base de données
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

//------------------------------------------------------------------------

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

//------------------------------------------------------------------------
// UPDATE / Modification de ressources
//------------------------------------------------------------------------

exports.updateSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {

          const filename = sauce.imageUrl.split("/images/")[1];

          fs.unlink(`images/${filename}`, () => {
            const sauceObject = req.file ? 
              {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get("host")}/images/${ req.file.filename }`,
              } : { ...req.body };

            Sauce.updateOne({ _id: req.params.id },{ ...sauceObject, _id: req.params.id })
              .then(() => res.status(200).json({ message: "Sauce modifié !" }))
              .catch((error) => res.status(400).json({ error }));
          });
    })
    .catch((error) => res.status(400).json({ error }));
};


//------------------------------------------------------------------------
// DELETE / Suppression de ressources
//------------------------------------------------------------------------

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {

          const filename = sauce.imageUrl.split("/images/")[1];

          // fs.unlink: Permet la suppression du fichier
          fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
              .then(() => res.status(200).json({ message: "Sauce supprimé !" }))
              .catch((error) => res.status(400).json({ error }));
          });  
    })
    .catch((error) => res.status(500).json({ error }));
};
