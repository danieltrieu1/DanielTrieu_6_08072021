const express = require('express');

// Permet de créer des routeurs séparés pour chaque route principale de l'application
const router = express.Router();

const userCtrl = require('../controllers/user');

const checkPassword = require('../middleware/password-validator');
const checkEmail = require("../middleware/email-validator");

router.post('/signup', checkEmail, checkPassword, userCtrl.signup);
router.post('/login', userCtrl.login);

// Exportation des méthodes attribuées aux routes
module.exports = router;