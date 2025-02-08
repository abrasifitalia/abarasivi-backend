const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Article = require('../models/Article');
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');

// Configuration de Multer pour gérer les fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
    
    // Vérifiez si le dossier uploads existe, sinon créez-le
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true }); // Créer le dossier s'il n'existe pas
    }
    
    cb(null, uploadsDir); // Dossier où les fichiers seront stockés
  },
  filename: function (req, file, cb) {
    const fileExtension = path.extname(file.originalname); // Extension du fichier
    const uniqueFilename = Date.now() + fileExtension; // Nom unique pour le fichier
    cb(null, uniqueFilename);
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // Set limit to 10 MB (adjust as needed)
});

// Ajouter un article avec image, vidéo et fiche technique (fichier PDF)
const addArticle = async (req, res) => {
  try {
    const { name, description, price, category, subcategory, fonctionnalite } = req.body;
    
    // Vérifiez si tous les champs sont présents
    if (!name || !description || !price || !category || !subcategory) {
      return res.status(400).json({ message: 'Tous les champs requis doivent être remplis' });
    }
    
    const existingCategory = await Category.findById(category);
    const existingSubcategory = await Subcategory.findById(subcategory);

    if (!existingCategory || !existingSubcategory) {
      return res.status(400).json({ message: 'Catégorie ou sous-catégorie invalide' });
    }

    // Si des fichiers sont envoyés (image, vidéo, fiche technique), vérifiez leur validité
    const image = req.files['image'] ? '/uploads/' + req.files['image'][0].filename : null;
    const video = req.files['video'] ? '/uploads/' + req.files['video'][0].filename : null;
    const ficheTechnique = req.files['ficheTechnique'] ? '/uploads/' + req.files['ficheTechnique'][0].filename : null;

    // Vérifiez si les fichiers sont valides (par exemple, types de fichiers, taille)
    if (req.files['image'] && !['.jpg', '.jpeg', '.png'].includes(path.extname(req.files['image'][0].originalname))) {
      return res.status(400).json({ message: 'Format d\'image non valide' });
    }
    if (req.files['video'] && !['.mp4', '.avi'].includes(path.extname(req.files['video'][0].originalname))) {
      return res.status(400).json({ message: 'Format de vidéo non valide' });
    }
    if (req.files['ficheTechnique'] && path.extname(req.files['ficheTechnique'][0].originalname) !== '.pdf') {
      return res.status(400).json({ message: 'La fiche technique doit être un fichier PDF' });
    }

    // Créer un nouvel article
    const newArticle = new Article({
      name,
      description,
      price,
      category,
      subcategory,
      image,
      video,
      fonctionnalite,
      ficheTechnique, 
    });

    // Sauvegarder l'article dans la base de données
    await newArticle.save();
    res.status(201).json({ message: 'Article ajouté avec succès', article: newArticle });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur, impossible d\'ajouter l\'article' });
  }
};

// Liste des articles
const listArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    res.status(200).json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des articles' });
  }
};

// Supprimer un article
const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findByIdAndDelete(id);
    if (!article) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }
    res.status(200).json({ message: 'Article supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'article' });
  }
};

// Mettre à jour un article
const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Si des fichiers sont envoyés, vérifiez leur validité avant de mettre à jour
    if (req.files['image']) {
      if (!['.jpg', '.jpeg', '.png'].includes(path.extname(req.files['image'][0].originalname))) {
        return res.status(400).json({ message: 'Format d\'image non valide' });
      }
      updatedData.image = '/uploads/' + req.files['image'][0].filename;
    }
    if (req.files['video']) {
      if (!['.mp4', '.avi'].includes(path.extname(req.files['video'][0].originalname))) {
        return res.status(400).json({ message: 'Format de vidéo non valide' });
      }
      updatedData.video = '/uploads/' + req.files['video'][0].filename;
    }
    if (req.files['ficheTechnique']) {
      if (path.extname(req.files['ficheTechnique'][0].originalname) !== '.pdf') {
        return res.status(400).json({ message: 'La fiche technique doit être un fichier PDF' });
      }
      updatedData.ficheTechnique = '/uploads/' + req.files['ficheTechnique'][0].filename;
    }

    const article = await Article.findByIdAndUpdate(id, updatedData, { new: true });
    if (!article) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }
    res.status(200).json({ message: 'Article mis à jour avec succès', article });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'article' });
  }
};

const getArticle = async (req, res) => {
  try {
    const { id } = req.params; // Récupérer l'ID de l'article à partir des paramètres de la requête

    // Trouver l'article avec son ID
    const article = await Article.findById(id).populate('category subcategory'); // Vous pouvez peupler les informations de catégorie et sous-catégorie si nécessaire

    if (!article) {
      console.log('Erreur: Article non trouvé'); // Log d'erreur
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    console.log('Article récupéré:', article); // Log de succès
    res.status(200).json(article); // Renvoie l'article trouvé
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'article' });
  }
};

// Recuperer les articles par categorie and subcategory




const getArticlesByCategoryAndSubcategory = async (req, res) => {
  try {
    const { categoryId, subcategoryId } = req.params;

    console.log(`Received categoryId: ${categoryId}, subcategoryId: ${subcategoryId}`);

    // Convert IDs to ObjectId using the correct syntax
    const categoryObjectId = new mongoose.Types.ObjectId(categoryId);
    const subcategoryObjectId = new mongoose.Types.ObjectId(subcategoryId);

    // Query directly on `category` and `subcategory` fields
    const articles = await Article.find({
      category: categoryObjectId,
      subcategory: subcategoryObjectId,
    });

    if (!articles || articles.length === 0) {
      console.log('No articles found for the given category and subcategory IDs.');
      return res.status(404).json({ message: 'No articles found.' });
    }

    console.log('Articles found:', articles);
    res.status(200).json(articles);
  } catch (error) {
    console.error('Error retrieving articles:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};





module.exports = { addArticle, listArticles, deleteArticle, updateArticle, upload, getArticle, getArticlesByCategoryAndSubcategory };
