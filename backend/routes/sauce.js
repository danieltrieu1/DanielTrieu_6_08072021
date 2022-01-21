const express = require("express");
const router = express.Router();

const sauceCtrl = require("../controllers/sauce");
const likeCtrl = require("../controllers/like");

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config.js");

// CREATE
router.post("/", auth, multer, sauceCtrl.createSauce);
//------------------------------------------------------------------------
router.post("/:id/like", auth, likeCtrl.likeSauce);

// READ
router.get("/", auth, sauceCtrl.getAllSauces);
router.get("/:id", auth, sauceCtrl.getOneSauce);

// UPDATE
router.put("/:id", auth, multer, sauceCtrl.updateSauce);

// DELETE
router.delete("/:id", auth, sauceCtrl.deleteSauce);

module.exports = router;
