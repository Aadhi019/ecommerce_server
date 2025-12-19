const Product = require('../models/Product');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, search, sort } = req.query;
    
    let query = { isActive: true };
    
    if (category) query.category = category;
    if (search) query.$text = { $search: search };
    
    let sortOption = {};
    if (sort === 'price_low') sortOption.price = 1;
    else if (sort === 'price_high') sortOption.price = -1;
    else if (sort === 'newest') sortOption.createdAt = -1;
    else sortOption.createdAt = -1;

    const products = await Product.find(query)
      .populate('category', 'name')
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const images = [];
    
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer, 'products');
        images.push(result);
      }
    }

    const product = await Product.create({
      ...req.body,
      images
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    Object.assign(product, req.body);
    
    if (req.files && req.files.length > 0) {
      for (const image of product.images) {
        await deleteFromCloudinary(image.public_id);
      }
      
      const images = [];
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer, 'products');
        images.push(result);
      }
      product.images = images;
    }

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    for (const image of product.images) {
      await deleteFromCloudinary(image.public_id);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };