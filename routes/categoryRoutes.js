const express = require('express');
const categoryController = require('../controllers/categoryController');  // Assurez-vous que ce chemin est correct
const router = express.Router();

// Route pour créer une catégorie
router.post('/categories', categoryController.createCategory);  // Utilisez correctement la fonction createCategory

// Route pour récupérer toutes les catégories
router.get('/categories', categoryController.getAllCategories); // Utilisez la fonction getAllCategories
// Supprimer une catégorie par son ID
router.delete('/categories/:id', categoryController.deleteCategory);
module.exports = router;
