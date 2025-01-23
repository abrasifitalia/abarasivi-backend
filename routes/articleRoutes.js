const express = require('express');
const multer = require('multer');
//const multer = require('multer');
const router = express.Router();
//const multer = require('multer');
const { addArticle, listArticles, deleteArticle, updateArticle, upload, getArticle, getArticlesByCategoryAndSubcategory } = require('../controllers/articleController');

   router.post('/article', upload.fields([{ name: 'image' }, { name: 'video' }, { name: 'ficheTechnique' }]),   addArticle);
  

// Lister tous les articles
router.get('/article', listArticles);

// Supprimer un article
router.delete('/article/:id', deleteArticle);
// Mettre à jour un article
router.put('/article/:id', upload.fields([{ name: 'image' }, { name: 'video' }, { name: 'ficheTechnique' }]),  updateArticle); // Accessible via PUT /api/article/:id
// Route pour récupérer un article par son ID
router.get('/article/get/:id', getArticle );
// Route for retrieving articles by category and subcategory
router.get('/category/:categoryId/subcategory/:subcategoryId', getArticlesByCategoryAndSubcategory);


module.exports = router;
