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
router.post('/client/register', registerClient);
router.post('/client/login', loginClient);
router.get('/client/me', auth, getClientInfo);
router.get('/client/list', getAllClients);
router.delete('/client/:id', deleteClient);

// Password reset routes with proper prefixes
router.post('/client/request-reset', requestPasswordReset);
router.post('/client/reset-password', resetPassword);

module.exports = router;
