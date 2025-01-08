// controllers/subcategoryController.js

const Subcategory = require('../models/Subcategory');
const Category = require('../models/Category');

// Ajouter une sous-catégorie
const addSubcategory = async (req, res) => {
    const { name, categoryId } = req.body;

    try {
        // Vérifier si la catégorie existe
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Créer une nouvelle sous-catégorie
        const newSubcategory = new Subcategory({
            name,
            categoryId
        });

        await newSubcategory.save();

        res.status(201).json({
            message: 'Subcategory created successfully',
            subcategory: newSubcategory
        });
    } catch (error) {
        console.error('Error adding subcategory:', error);
        res.status(500).json({ message: 'Error adding subcategory', error: error.message });
    }
};

// Lister toutes les sous-catégories
const listSubcategories = async (req, res) => {
    try {
        const subcategories = await Subcategory.find().populate('categoryId', 'name'); // Récupérer aussi le nom de la catégorie
        res.status(200).json(subcategories);
    } catch (error) {
        console.error('Error listing subcategories:', error);
        res.status(500).json({ message: 'Error listing subcategories', error: error.message });
    }
};

// Supprimer une sous-catégorie par ID
const mongoose = require('mongoose');

const deleteSubcategory = async (req, res) => {
    const subcategoryId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
        return res.status(400).json({ message: 'Invalid subcategory ID format' });
    }

    try {
        const subcategory = await Subcategory.findByIdAndDelete(subcategoryId);
        if (!subcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }
        res.status(200).json({ message: 'Subcategory deleted successfully' });
    } catch (error) {
        console.error('Error deleting subcategory:', error);
        res.status(500).json({ message: 'Error deleting subcategory', error: error.message });
    }
};

// Récupérer les sous-catégories par catégorie
const getSubcategoriesByCategory = async (req, res) => {
    const { categoryId } = req.params;

    try {
        // Vérifiez si la catégorie existe
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Trouver les sous-catégories associées à cette catégorie
        const subcategories = await Subcategory.find({ categoryId });

        if (subcategories.length === 0) {
            return res.status(404).json({ message: 'No subcategories found for this category' });
        }

        res.status(200).json({ subCategories: subcategories });
    } catch (error) {
        console.error('Error fetching subcategories by category:', error);
        res.status(500).json({ message: 'Error fetching subcategories', error: error.message });
    }
};




const getSubcategories = async (req, res) => {
    try {
        const subcategories = await Subcategory.find().populate('categoryId', 'name');
        res.status(200).json(subcategories);
    } catch (error) {
        console.error("Erreur lors de la récupération des sous-catégories :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};


module.exports = { addSubcategory, listSubcategories, deleteSubcategory, getSubcategoriesByCategory, getSubcategories };