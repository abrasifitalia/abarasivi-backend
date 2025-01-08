// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const { addMessage, listMessages, deleteMessage } = require('../controllers/messageController');

// Ajouter un message
router.post('/message', addMessage); // POST /api/message

// Lister tous les messages
router.get('/message', listMessages); // GET /api/message

// Supprimer un message
router.delete('/message/:id', deleteMessage); // DELETE /api/message/:id

module.exports = router;
