// routes/subcategoryRoutes.js

const express = require('express');
const router = express.Router();
const { addSubcategory, listSubcategories, deleteSubcategory, getSubcategoriesByCategory, getSubcategories  } = require('../controllers/subcategoryController');

// Route pour ajouter une sous-catégorie
router.post('/subcategory', addSubcategory);

// Route pour lister toutes les sous-catégories
router.get('/subcategory', listSubcategories);

// Route pour supprimer une sous-catégorie par ID
router.delete('/subcategory/:id', deleteSubcategory);

// Récupérer les sous-catégories par catégorie

router.get('/subcategory/category/:categoryId', getSubcategoriesByCategory);
// Définir la route GET pour récupérer les sous-catégories
router.get('/subcategory/get', getSubcategories);
module.exports = router;
