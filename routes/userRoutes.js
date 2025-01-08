const express = require('express');
const { registerUser, loginUser, listUsers } = require('../controllers/userController'); // Import des fonctions du contrôleur
const authenticateToken = require('../middlewares/auth'); // Middleware pour l'authentification via JWT
const router = express.Router();

// Route pour enregistrer un utilisateur
router.post('/register', registerUser);

// Route pour connecter un utilisateur
router.post('/login', loginUser);

// Route protégée pour lister les utilisateurs
// Cette route nécessite que l'utilisateur soit authentifié via un token JWT
router.get('/users', authenticateToken, listUsers);

module.exports = router;
