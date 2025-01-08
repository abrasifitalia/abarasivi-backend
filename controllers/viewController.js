// controllers/viewController.js
const View = require('../models/View');
const Article = require('../models/Article');
const Client = require('../models/Client'); // Modèle du client

// Ajouter ou mettre à jour la vue d'un article par un client
const addView = async (req, res) => {
    const { clientId, articleId } = req.body;

    try {
        // Vérifier si l'article existe
        const article = await Article.findById(articleId);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        // Vérifier si l'utilisateur a déjà vu cet article
        const existingView = await View.findOne({ client: clientId, article: articleId });

        if (existingView) {
            // Si la vue existe déjà, incrémenter le nombre de vues
            existingView.views += 1;
            await existingView.save();
            return res.status(200).json({ message: 'View updated', view: existingView });
        } else {
            // Sinon, créer une nouvelle vue pour cet utilisateur et article
            const newView = new View({
                client: clientId,
                article: articleId,
                views: 1
            });

            await newView.save();
            return res.status(201).json({ message: 'View added', view: newView });
        }
    } catch (error) {
        console.error('Error adding/updating view:', error);
        res.status(500).json({ message: 'Error adding/updating view', error: error.message });
    }
};

// Lister toutes les vues d'un article (pour vérifier combien de fois il a été vu)
const listViews = async (req, res) => {
    const articleId = req.params.articleId;

    try {
        const views = await View.find({ article: articleId }).populate('client', 'firstName email'); // On récupère aussi les informations de l'utilisateur
        res.status(200).json(views);
    } catch (error) {
        console.error('Error listing views:', error);
        res.status(500).json({ message: 'Error listing views', error: error.message });
    }
};

// Supprimer une vue d'un article par l'utilisateur
// Fonction pour supprimer une vue spécifique
const deleteView = async (req, res) => {
    const { viewId } = req.params;
  
    try {
      const viewToDelete = await View.findByIdAndDelete(viewId);
  
      if (!viewToDelete) {
        return res.status(404).json({ message: 'Vue non trouvée.' });
      }
  
      return res.status(200).json({ message: 'Vue supprimée avec succès.' });
    } catch (error) {
      console.error('Erreur lors de la suppression de la vue:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };
  const getAllViews = async (req, res) => {
    try {
      // Récupérer toutes les vues avec les informations client et article
      const views = await View.find()
        .populate('client')  // Remplir les informations du client
        .populate('article') // Remplir les informations de l'article
        .exec();
  
      // Vérifier si des vues sont trouvées
      if (!views || views.length === 0) {
        return res.status(404).json({ message: 'Aucune vue trouvée.' });
      }
  
      // Retourner les vues dans la réponse
      res.status(200).json(views);
    } catch (error) {
      console.error('Erreur lors de la récupération des vues:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };
module.exports = { addView, listViews, deleteView,  getAllViews };