const express = require('express');
const router = express.Router();
const { 
    registerClient, 
    loginClient, 
    getClientInfo, 
    getAllClients, 
    deleteClient,
    requestPasswordReset, // Add these new functions
    resetPassword        // to the destructured import
} = require('../controllers/ClientController');
const auth = require('../middlewares/auth'); // Pour vérifier le token JWT

// Route d'inscription du client
router.post('/client/register', registerClient);

// Route de connexion du client
router.post('/client/login', loginClient);

// Route pour obtenir les informations du client
router.get('/client/me', auth, getClientInfo);
router.get('/client/list', getAllClients);
// Supprimer un client par son ID
router.delete('/client/:id', deleteClient);

// Password reset routes
router.post('/client/request-reset', requestPasswordReset);
router.post('/client/reset-password', resetPassword);

module.exports = router;
