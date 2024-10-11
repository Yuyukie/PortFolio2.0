const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

// Route pour la connexion
router.post("/login", userController.login);

module.exports = router;
