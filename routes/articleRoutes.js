const express = require('express');
const multer = require('multer');
//const multer = require('multer');
const router = express.Router();
//const multer = require('multer');
const { addArticle, listArticles, deleteArticle, updateArticle, upload, getArticle } = require('../controllers/articleController');

  router.post('/article', upload.fields([{ name: 'image' }, { name: 'video' }]),   addArticle);
  

// Lister tous les articles
router.get('/article', listArticles);

// Supprimer un article
router.delete('/article/:id', deleteArticle);
// Mettre à jour un article
router.put('/article/:id', upload.fields([{ name: 'image' }, { name: 'video' }]),  updateArticle); // Accessible via PUT /api/article/:id
// Route pour récupérer un article par son ID
router.get('/article/get/:id', getArticle );
module.exports = router;
