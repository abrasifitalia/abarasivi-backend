const express = require('express');
const router = express.Router();
const { 
    registerClient, 
    loginClient, 
    getClientInfo, 
    getAllClients, 
    deleteClient,
    requestPasswordReset,
    resetPassword
} = require('../controllers/ClientController');
const auth = require('../middlewares/auth');

// Routes without client prefix (now handled by server.js)
router.post('/register', registerClient);
router.post('/login', loginClient);
router.get('/me', auth, getClientInfo);
router.get('/list', getAllClients);
router.delete('/:id', deleteClient);
router.post('/request-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

module.exports = router;
