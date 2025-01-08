const express = require('express');
const router = express.Router();
const {
  createOrder,
  listOrders,
  updateOrderStatus,
  deleteOrder,
  getOrders
} = require('../controllers/orderController');

// Ajouter une commande
router.post('/order', createOrder);

// Lister toutes les commandes (Admin)
router.get('/order', listOrders);

// Obtenir une liste spécifique de commandes
router.get('/order/getOrders', getOrders);

// Mettre à jour le statut d'une commande
router.put('/order/:orderId', updateOrderStatus);

// Supprimer une commande
router.delete('/order/:orderId', deleteOrder);

module.exports = router;
