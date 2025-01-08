const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');

// Récupérer toutes les catégories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Créer une nouvelle catégorie
exports.createCategory = async (req, res) => {
  const { name } = req.body;

  try {
    const category = new Category({ name });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Supprimer une catégorie
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Supprimer les sous-catégories liées à cette catégorie (si vous le souhaitez)
    await Subcategory.deleteMany({ category: id });

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
