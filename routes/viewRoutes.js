// routes/viewRoutes.js
const express = require('express');
const router = express.Router();
const { addView, listViews, deleteView, getAllViews } = require('../controllers/viewController');

// Ajouter une vue (lorsque le client entre dans la page de détail de l'article)
router.post('/view', addView); // POST /api/view
// Route pour récupérer toutes les vues
router.get('/view', getAllViews);
// Lister les vues d'un article
router.get('/view/:articleId', listViews); // GET /api/view/:articleId

// Supprimer une vue
router.delete('/view/:viewId', deleteView);
module.exports = router;
