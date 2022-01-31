const Sauce = require("../models/Sauce");
const fs = require("fs");

//------------------------------------------------------------------------
// CREATE / Création de ressources
//------------------------------------------------------------------------

//
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);

  // Suppression de _id car l'utilisation du mot-clé new avec un modèle Mongoose crée par défaut un champ _id
  delete sauceObject._id;

  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
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
      if (sauce.userId !== req.auth) {
        res.status(400).json({ error })
      } else if (sauce.userId == req.auth) {
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
        }
    })
    .catch((error) => res.status(400).json({ error }));
};


//------------------------------------------------------------------------
// DELETE / Suppression de ressources
//------------------------------------------------------------------------

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId !== req.auth) {
        res.status(400).json({ error })
      } else if (sauce.userId == req.auth) {

          const filename = sauce.imageUrl.split("/images/")[1];

          fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
              .then(() => res.status(200).json({ message: "Sauce supprimé !" }))
              .catch((error) => res.status(400).json({ error }));
          });  
        }
    })
    .catch((error) => res.status(500).json({ error }));
};
