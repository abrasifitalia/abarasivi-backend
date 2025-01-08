const express = require('express');
const router = express.Router();
const Category = require('../models/Category'); // Assurez-vous que le modèle existe
const SousCategory = require('../models/Subcategory');
const Article = require('../models/Article');
const Message = require('../models/Message');

router.get('/dashboard-stats', async (req, res) => {
  try {
    const categoriesCount = await Category.countDocuments();
    const sousCategoriesCount = await SousCategory.countDocuments();
    const articlesCount = await Article.countDocuments();
    const messagesCount = await Message.countDocuments();

    res.json({
      categoriesCount,
      sousCategoriesCount,
      articlesCount,
      messagesCount,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
});

module.exports = router;
