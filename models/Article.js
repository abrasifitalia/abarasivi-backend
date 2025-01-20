// models/Article.js
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false, // Vous pouvez rendre l'image requise ou optionnelle selon vos besoins
  },
  video: {
    type: String,
    required: false, // Optionnelle
  },
  fonctionnalite: {
    type: String,
    required: false, // Optionnelle
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  ficheTechnique: { // Ajout de la fiche technique
    type: String,
    required: false, // Optionnelle
  },
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },

}, {
  timestamps: true,
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
