const mongoose = require('mongoose');

const Order = require('../models/Order');

// Créer une nouvelle commande
exports.createOrder = async (req, res) => {
  try {
    const { clientId, items } = req.body;

    // Log pour vérifier les données reçues
    console.log("Payload reçu:", req.body);

    // Vérifier que les données nécessaires sont fournies
    if (!clientId || !items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Invalid data. Check clientId and items.' });
    }

    // Créer une nouvelle commande
    const newOrder = new Order({ clientId, items });
    await newOrder.save();

    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Lister toutes les commandes
exports.listOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('clientId', 'firstName lastName email phone')  // Vérifier les champs sélectionnés
      .populate('items.articleId', 'name price image');

    console.log(orders); // Vérifiez la structure de l'objet renvoyé
    res.status(200).json(orders);
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes", error);
    res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
  }
};


// Mettre à jour le statut d'une commande
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByIdAndUpdate(orderId, { status: req.body.status }, { new: true });
    if (!order) return res.status(404).json({ error: 'Commande non trouvée' });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
  }
};

// Supprimer une commande
exports.deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) return res.status(404).json({ error: 'Commande non trouvée' });
    res.status(200).json({ message: 'Commande supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la commande' });
  }
};

// Obtenir une liste spécifique de commandes
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('clientId').populate('items.articleId');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
  }
};
