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
router.post('/create_order', createOrder);

// Lister toutes les commandes (Admin)
router.get('/all_order', listOrders);

// Obtenir une liste spécifique de commandes
router.get('/some_order/getOrders', getOrders);

// Mettre à jour le statut d'une commande
router.put('/update_order/:orderId', updateOrderStatus);

// Supprimer une commande
router.delete('/delete_order/:orderId', deleteOrder);

module.exports = router;
