const Category = require('../models/Category');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    let image = {};
    
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'categories');
      image = result;
    }

    const category = await Category.create({
      ...req.body,
      image
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    Object.assign(category, req.body);
    
    if (req.file) {
      if (category.image?.public_id) {
        await deleteFromCloudinary(category.image.public_id);
      }
      const result = await uploadToCloudinary(req.file.buffer, 'categories');
      category.image = result;
    }

    await category.save();
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (category.image?.public_id) {
      await deleteFromCloudinary(category.image.public_id);
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };