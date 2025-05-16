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

// Client routes
router.post('/register', registerClient);
router.post('/login', loginClient);
router.get('/me', auth, getClientInfo);
router.get('/list', getAllClients);
router.delete('/delete_client/:id', deleteClient);

// Password reset routes with proper prefixes
router.post('/request-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

module.exports = router;
