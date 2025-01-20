const multer = require('multer');
const path = require('path');
const fs = require('fs');
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
    cb(null, Date.now() + fileExtension); // Nom unique pour le fichier
  },
});

const upload = multer({ storage: storage });

// Ajouter un article avec image, vidéo et fiche technique (fichier PDF)
const addArticle = async (req, res) => {
  try {
    const { name, description, price, category, subcategory, fonctionnalite } = req.body;
    
    // Vérifiez si tous les champs sont présents
    if (!name || !description || !price || !category || !subcategory || !req.files['ficheTechnique']) {
      return res.status(400).json({ message: 'Tous les champs requis doivent être remplis' });
    }
    const existingCategory = await Category.findById(category);
    const existingSubcategory = await Subcategory.findById(subcategory);

    if (!existingCategory || !existingSubcategory) {
      return res.status(400).json({ message: 'Catégorie ou sous-catégorie invalide' });
    }

    // Si des fichiers sont envoyés (image, vidéo, fiche technique), récupérez leurs chemins
    const image = req.files['image'] ? '/uploads/' + req.files['image'][0].filename : null;
    const video = req.files['video'] ? '/uploads/' + req.files['video'][0].filename : null;
    const ficheTechnique = req.files['ficheTechnique'] ? '/uploads/' + req.files['ficheTechnique'][0].filename : null;

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
      ficheTechnique, // Ajout de la fiche technique (fichier PDF)
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
    
    // Vérifiez si la fiche technique est présente
    if (!req.files['ficheTechnique']) {
      return res.status(400).json({ message: 'La fiche technique est requise' });
    }

    // Si des fichiers sont envoyés, mettez à jour les champs image, vidéo et fiche technique
    if (req.files['image']) {
      updatedData.image = '/uploads/' + req.files['image'][0].filename;
    }
    if (req.files['video']) {
      updatedData.video = '/uploads/' + req.files['video'][0].filename;
    }
    if (req.files['ficheTechnique']) {
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
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    res.status(200).json(article); // Renvoie l'article trouvé
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'article' });
  }
};
module.exports = { addArticle, listArticles, deleteArticle, updateArticle, upload, getArticle };
